import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { ApiResponse } from "@/types/api";

interface CreateCategoryRequest {
  nameZh: string;
  nameEn: string;
}

interface CategoryResponseData {
  id: string;
  nameZh: string;
  nameEn: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: CreateCategoryRequest = await request.json();
    const { nameZh, nameEn } = body;

    // 验证中文名称
    if (!nameZh || typeof nameZh !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "中文分类名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证英文名称
    if (!nameEn || typeof nameEn !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "英文分类名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 检查中文名称是否已存在
    const existingZh = await Category.findOne({ nameZh });
    if (existingZh) {
      const response: ApiResponse = {
        success: false,
        message: "该中文分类名称已存在",
        status: 409,
      };
      return NextResponse.json(response);
    }

    // 检查英文名称是否已存在
    const existingEn = await Category.findOne({ nameEn });
    if (existingEn) {
      const response: ApiResponse = {
        success: false,
        message: "该英文分类名称已存在",
        status: 409,
      };
      return NextResponse.json(response);
    }

    // 创建新分类
    const category = await Category.create({
      nameZh: nameZh.trim(),
      nameEn: nameEn.trim(),
    });

    const response: ApiResponse<CategoryResponseData> = {
      success: true,
      message: "产品分类创建成功",
      data: {
        id: category._id.toString(),
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      status: 201,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("创建产品分类错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "创建产品分类失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}
