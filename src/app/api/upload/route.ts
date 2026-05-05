import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { ApiResponse } from "@/types/api";

interface UploadResponseData {
  urls: string[];
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

function ensureUploadDir(): void {
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function validateFile(file: File): { valid: boolean; message?: string } {
  const ext = path.extname(file.name).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      message: `不支持的文件格式: ${file.name}，只允许 jpg、jpeg、png 格式`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `文件过大: ${file.name}，大小限制 1MB`,
    };
  }

  return { valid: true };
}

function generateFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}${ext}`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    ensureUploadDir();

    const formData = await request.formData();
    const files: File[] = [];

    // 支持单张或多张图片上传
    const singleImage = formData.get("image");
    const multipleImages = formData.getAll("images");

    if (singleImage instanceof File) {
      files.push(singleImage);
    }

    multipleImages.forEach((file) => {
      if (file instanceof File) {
        files.push(file);
      }
    });

    if (files.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "请选择要上传的图片",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证所有文件
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        const response: ApiResponse = {
          success: false,
          message: validation.message || "文件验证失败",
          status: 400,
        };
        return NextResponse.json(response);
      }
    }

    // 保存文件
    const urls: string[] = [];

    for (const file of files) {
      const fileName = generateFileName(file.name);
      const filePath = path.join(UPLOAD_DIR, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      // 返回可访问的 URL 路径
      urls.push(`/uploads/${fileName}`);
    }

    const response: ApiResponse<UploadResponseData> = {
      success: true,
      message: files.length === 1 ? "图片上传成功" : `成功上传 ${files.length} 张图片`,
      data: { urls },
      status: 200,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("上传错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "图片上传失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "请提供要删除的图片路径",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 从 URL 中提取文件名，防止目录遍历
    const urlPath = url.startsWith("/") ? url.slice(1) : url;
    const pathParts = urlPath.split("/");
    const fileName = pathParts[pathParts.length - 1];

    // 只允许删除 uploads 目录下的文件
    if (pathParts[0] !== "uploads" || !fileName) {
      const response: ApiResponse = {
        success: false,
        message: "无效的图片路径",
        status: 400,
      };
      return NextResponse.json(response);
    }

    const filePath = path.join(UPLOAD_DIR, fileName);

    // 安全检查：确保文件路径在 UPLOAD_DIR 内
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(UPLOAD_DIR);
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      const response: ApiResponse = {
        success: false,
        message: "无效的文件路径",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 检查文件是否存在
    if (!existsSync(filePath)) {
      const response: ApiResponse = {
        success: false,
        message: "图片文件不存在",
        status: 404,
      };
      return NextResponse.json(response);
    }

    // 删除文件
    await unlink(filePath);

    const response: ApiResponse = {
      success: true,
      message: "图片删除成功",
      status: 200,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("删除图片错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "图片删除失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}
