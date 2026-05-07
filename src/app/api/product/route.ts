import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { ApiResponse } from "@/types/api";
import { verifyToken, unauthorizedResponse } from "@/lib/auth";

interface CreateProductRequest {
  nameZh: string;
  nameEn: string;
  categoryId: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
  detailImages: string[];
}

interface UpdateProductRequest {
  id: string;
  nameZh?: string;
  nameEn?: string;
  categoryId?: string;
  categoryZh?: string;
  categoryEn?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  coverImage?: string;
  detailImages?: string[];
}

interface ProductResponseData {
  id: string;
  nameZh: string;
  nameEn: string;
  categoryId: string;
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
    // 验证登录
    const payload = verifyToken(request);
    if (!payload) {
      return unauthorizedResponse();
    }

    await connectDB();

    const body: CreateProductRequest = await request.json();
    const {
      nameZh,
      nameEn,
      categoryId,
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

    // 验证分类ID
    if (!categoryId || typeof categoryId !== "string") {
      const response: ApiResponse = {
        success: false,
        message: "产品分类ID不能为空",
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
      categoryId: categoryId.trim(),
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
        categoryId: product.categoryId,
        categoryZh: product.categoryZh,
        categoryEn: product.categoryEn,
        descriptionZh: product.descriptionZh,
        descriptionEn: product.descriptionEn,
        coverImage: product.coverImage,
        detailImages: product.detailImages,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
      status: 200,
    };

    return NextResponse.json(response, { status: 200 });
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

// GET /api/product - 获取产品列表或单个产品详情
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");
    const id = searchParams.get("id");
    const categoryId = searchParams.get("categoryId");

    // 如果提供了 id，返回单个产品详情
    if (id) {
      const product = await Product.findById(id);

      if (!product) {
        const response: ApiResponse = {
          success: false,
          message: "产品不存在",
          status: 404,
        };
        return NextResponse.json(response, { status: 404 });
      }

      const data: ProductResponseData = {
        id: product._id.toString(),
        nameZh: product.nameZh,
        nameEn: product.nameEn,
        categoryId: product.categoryId,
        categoryZh: product.categoryZh,
        categoryEn: product.categoryEn,
        descriptionZh: product.descriptionZh,
        descriptionEn: product.descriptionEn,
        coverImage: product.coverImage,
        detailImages: product.detailImages,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      const response: ApiResponse<ProductResponseData> = {
        success: true,
        message: "获取产品详情成功",
        data,
        status: 200,
      };

      return NextResponse.json(response, { status: 200 });
    }

    // 构建查询条件
    const query: Record<string, unknown> = {};
    if (keyword) {
      query.$or = [
        { nameZh: { $regex: keyword, $options: "i" } },
        { nameEn: { $regex: keyword, $options: "i" } },
      ];
    }
    if (categoryId) {
      query.categoryId = categoryId;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    const data: ProductResponseData[] = products.map((product) => ({
      id: product._id.toString(),
      nameZh: product.nameZh,
      nameEn: product.nameEn,
      categoryId: product.categoryId,
      categoryZh: product.categoryZh,
      categoryEn: product.categoryEn,
      descriptionZh: product.descriptionZh,
      descriptionEn: product.descriptionEn,
      coverImage: product.coverImage,
      detailImages: product.detailImages,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    const response: ApiResponse<ProductResponseData[]> = {
      success: true,
      message: "获取产品列表成功",
      data,
      status: 200,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("获取产品列表错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "获取产品列表失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}

// PUT /api/product - 更新产品
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // 验证登录
    const payload = verifyToken(request);
    if (!payload) {
      return unauthorizedResponse();
    }

    await connectDB();

    const body: UpdateProductRequest = await request.json();
    const { id, ...updateData } = body;

    // 验证产品ID
    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "产品ID不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 检查产品是否存在
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      const response: ApiResponse = {
        success: false,
        message: "产品不存在",
        status: 404,
      };
      return NextResponse.json(response);
    }

    // 如果有名称，进行trim处理
    const cleanedData: Record<string, unknown> = {};
    if (updateData.nameZh !== undefined) cleanedData.nameZh = updateData.nameZh.trim();
    if (updateData.nameEn !== undefined) cleanedData.nameEn = updateData.nameEn.trim();
    if (updateData.categoryId !== undefined) cleanedData.categoryId = updateData.categoryId.trim();
    if (updateData.categoryZh !== undefined) cleanedData.categoryZh = updateData.categoryZh.trim();
    if (updateData.categoryEn !== undefined) cleanedData.categoryEn = updateData.categoryEn.trim();
    if (updateData.descriptionZh !== undefined) cleanedData.descriptionZh = updateData.descriptionZh.trim();
    if (updateData.descriptionEn !== undefined) cleanedData.descriptionEn = updateData.descriptionEn.trim();
    if (updateData.coverImage !== undefined) cleanedData.coverImage = updateData.coverImage.trim();
    if (updateData.detailImages !== undefined) {
      cleanedData.detailImages = updateData.detailImages.map((img) => img.trim());
    }

    // 更新产品
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: cleanedData },
      { new: true, runValidators: true }
    );

    const response: ApiResponse<ProductResponseData> = {
      success: true,
      message: "产品更新成功",
      data: {
        id: updatedProduct!._id.toString(),
        nameZh: updatedProduct!.nameZh,
        nameEn: updatedProduct!.nameEn,
        categoryId: updatedProduct!.categoryId,
        categoryZh: updatedProduct!.categoryZh,
        categoryEn: updatedProduct!.categoryEn,
        descriptionZh: updatedProduct!.descriptionZh,
        descriptionEn: updatedProduct!.descriptionEn,
        coverImage: updatedProduct!.coverImage,
        detailImages: updatedProduct!.detailImages,
        createdAt: updatedProduct!.createdAt,
        updatedAt: updatedProduct!.updatedAt,
      },
      status: 200,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("更新产品错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "更新产品失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}

// DELETE /api/product - 删除产品
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

    // 验证产品ID
    if (!id) {
      const response: ApiResponse = {
        success: false,
        message: "产品ID不能为空",
        status: 400,
      };
      return NextResponse.json(response);
    }

    // 检查产品是否存在
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      const response: ApiResponse = {
        success: false,
        message: "产品不存在",
        status: 404,
      };
      return NextResponse.json(response);
    }

    // 删除产品
    await Product.findByIdAndDelete(id);

    const response: ApiResponse = {
      success: true,
      message: "产品删除成功",
      status: 200,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("删除产品错误:", error);

    const response: ApiResponse = {
      success: false,
      message: "删除产品失败，请稍后重试",
      status: 500,
    };

    return NextResponse.json(response);
  }
}
