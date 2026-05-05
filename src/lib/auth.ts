import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/types/api";

interface JwtPayload {
  userId: string;
  username: string;
}

/**
 * 验证请求中的 JWT token
 * @param request NextRequest 对象
 * @returns 验证成功返回 payload，失败返回 null
 */
export function verifyToken(request: NextRequest): JwtPayload | null {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    const token = parts[1];
    if (!token) {
      return null;
    }

    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * 创建未授权的响应
 * @returns NextResponse 未授权响应
 */
export function unauthorizedResponse(): NextResponse {
  const response: ApiResponse = {
    success: false,
    message: "未登录或登录已过期，请重新登录",
    status: 401,
  };
  return NextResponse.json(response, { status: 401 });
}
