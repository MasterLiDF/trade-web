import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { ApiResponse } from "@/types/api";
import { verifyToken, unauthorizedResponse } from "@/lib/auth";

interface CategoryRequest {
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

// GET - 获取所有分类
export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    const categories = await Category.find({}).sort({ createdAt: -1 });

    const data: CategoryResponseData[] = categories.map((category) => ({
      id: category._id.toString(),
      nameZh: category.nameZh,
      nameEn: category.nameEn,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    const response: ApiResponse<CategoryResponseData[]> = {
      success: true,
      message: "获取分类列表成功",
      data,
      status: 200,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("获取分类列表错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "获取分类列表失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}

// POST - 新增分类
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 验证登录
    const payload = verifyToken(request);
    if (!payload) {
      return unauthorizedResponse();
    }

    await connectDB();

    const body: CategoryRequest = await request.json();
    const { nameZh, nameEn } = body;

    // 验证中文名称
    if (!nameZh || typeof nameZh !== "string" || nameZh.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "分类中文名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证英文名称
    if (!nameEn || typeof nameEn !== "string" || nameEn.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "分类英文名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    const trimmedNameZh = nameZh.trim();
    const trimmedNameEn = nameEn.trim();

    // 检查中文名称是否已存在
    const existingZh = await Category.findOne({ nameZh: trimmedNameZh });
    if (existingZh) {
      const response: ApiResponse = {
        success: false,
        message: "该中文分类名称已存在",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 检查英文名称是否已存在
    const existingEn = await Category.findOne({ nameEn: trimmedNameEn });
    if (existingEn) {
      const response: ApiResponse = {
        success: false,
        message: "该英文分类名称已存在",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 创建新分类
    const category = await Category.create({
      nameZh: trimmedNameZh,
      nameEn: trimmedNameEn,
    });

    const response: ApiResponse<CategoryResponseData> = {
      success: true,
      message: "分类创建成功",
      data: {
        id: category._id.toString(),
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      status: 200,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("创建分类错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "创建分类失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}

// PUT - 编辑分类
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // 验证登录
    const payload = verifyToken(request);
    if (!payload) {
      return unauthorizedResponse();
    }

    await connectDB();

    const body: CategoryRequest & { id: string } = await request.json();
    const { id, nameZh, nameEn } = body;

    // 验证ID
    if (!id || typeof id !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "分类ID不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证中文名称
    if (!nameZh || typeof nameZh !== "string" || nameZh.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "分类中文名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证英文名称
    if (!nameEn || typeof nameEn !== "string" || nameEn.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "分类英文名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    const trimmedNameZh = nameZh.trim();
    const trimmedNameEn = nameEn.trim();

    // 查找要更新的分类
    const category = await Category.findById(id);
    if (!category) {
      const response: ApiResponse = {
        success: false,
        message: "分类不存在",
        status: 404,
      };
      return NextResponse.json(response);
    }

    // 检查中文名称是否与其他分类冲突
    const existingZh = await Category.findOne({
      nameZh: trimmedNameZh,
      _id: { $ne: id },
    });
    if (existingZh) {
      const response: ApiResponse = {
        success: false,
        message: "该中文分类名称已被其他分类使用",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 检查英文名称是否与其他分类冲突
    const existingEn = await Category.findOne({
      nameEn: trimmedNameEn,
      _id: { $ne: id },
    });
    if (existingEn) {
      const response: ApiResponse = {
        success: false,
        message: "该英文分类名称已被其他分类使用",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 更新分类
    category.nameZh = trimmedNameZh;
    category.nameEn = trimmedNameEn;
    await category.save();

    const response: ApiResponse<CategoryResponseData> = {
      success: true,
      message: "分类更新成功",
      data: {
        id: category._id.toString(),
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      status: 200,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("更新分类错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "更新分类失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}

// DELETE - 删除分类
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // 验证登录
    const payload = verifyToken(request);
    if (!payload) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // 验证ID
    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "分类ID不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 查找并删除分类
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      const response: ApiResponse = {
        success: false,
        message: "分类不存在",
        status: 404,
      };
      return NextResponse.json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "分类删除成功",
      status: 200,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("删除分类错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "删除分类失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}
