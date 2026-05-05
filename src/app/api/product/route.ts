import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { ApiResponse } from "@/types/api";

interface CreateProductRequest {
  nameZh: string;
  nameEn: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
  detailImages: string[];
}

interface ProductResponseData {
  id: string;
  nameZh: string;
  nameEn: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
  detailImages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: CreateProductRequest = await request.json();
    const {
      nameZh,
      nameEn,
      categoryZh,
      categoryEn,
      descriptionZh,
      descriptionEn,
      coverImage,
      detailImages,
    } = body;

    // 验证产品中文名称
    if (!nameZh || typeof nameZh !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品中文名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证产品英文名称
    if (!nameEn || typeof nameEn !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品英文名称不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证中文分类
    if (!categoryZh || typeof categoryZh !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品中文分类不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证英文分类
    if (!categoryEn || typeof categoryEn !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品英文分类不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证中文描述
    if (!descriptionZh || typeof descriptionZh !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品中文描述不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证英文描述
    if (!descriptionEn || typeof descriptionEn !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品英文描述不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证封面图
    if (!coverImage || typeof coverImage !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品封面图不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证详情图
    if (!detailImages || !Array.isArray(detailImages) || detailImages.length === 0) {
      const response: ApiResponse = {
        success: false,
        message: "产品详情图不能为空，至少需要1张",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 验证详情图数组中的每一项都是字符串
    if (!detailImages.every((img) => typeof img === "string")) {
      const response: ApiResponse = {
        success: false,
        message: "产品详情图格式不正确",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 创建新产品
    const product = await Product.create({
      nameZh: nameZh.trim(),
      nameEn: nameEn.trim(),
      categoryZh: categoryZh.trim(),
      categoryEn: categoryEn.trim(),
      descriptionZh: descriptionZh.trim(),
      descriptionEn: descriptionEn.trim(),
      coverImage: coverImage.trim(),
      detailImages: detailImages.map((img) => img.trim()),
    });

    const response: ApiResponse<ProductResponseData> = {
      success: true,
      message: "产品创建成功",
      data: {
        id: product._id.toString(),
        nameZh: product.nameZh,
        nameEn: product.nameEn,
        categoryZh: product.categoryZh,
        categoryEn: product.categoryEn,
        descriptionZh: product.descriptionZh,
        descriptionEn: product.descriptionEn,
        coverImage: product.coverImage,
        detailImages: product.detailImages,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
      status: 201,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("创建产品错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "创建产品失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}
