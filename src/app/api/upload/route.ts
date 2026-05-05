import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
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
