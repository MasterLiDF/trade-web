import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { ApiResponse } from '@/types/api';

interface RegisterRequest {
  username: string;
  password: string;
}

interface RegisterResponseData {
  id: string;
  username: string;
  createdAt: Date;
}

interface RegisterResult {
  success: boolean;
  message: string;
  data?: RegisterResponseData;
  status: number;
}

/**
 * 用户注册的核心逻辑
 * 可被 API Route 和脚本共同使用
 */
export async function registerUser(
  username: string,
  password: string
): Promise<RegisterResult> {
  // 验证用户名
  if (!username || typeof username !== 'string') {
    return {
      success: false,
      message: '用户名不能为空',
      status:400,
    };
  }

  if (username.length < 3 || username.length > 20) {
    return {
      success: false,
      message: '用户名长度需要在3-20个字符之间',
      status: 400,
    };
  }

  // 验证密码
  if (!password || typeof password !== 'string') {
    return {
      success: false,
      message: '密码不能为空',
      status: 400,
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: '密码至少需要6个字符',
      status: 400,
    };
  }

  // 检查用户名是否已存在
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return {
      success: false,
      message: '用户名已存在',
      status: 409,
    };
  }

  // 使用 bcryptjs 加密密码
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 创建新用户
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  await newUser.save();

  return {
    success: true,
    message: '注册成功',
    data: {
      id: newUser._id.toString(),
      username: newUser.username,
      createdAt: newUser.createdAt,
    },
    status: 201,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: RegisterRequest = await request.json();
    const { username, password } = body;

    const result = await registerUser(username, password);

    const response: ApiResponse<RegisterResponseData> = {
      success: result.success,
      message: result.message,
      data: result.data,
      status:result.status
    };

    return NextResponse.json(response, { status: result.status });
  } catch (error) {
    console.error('注册错误:', error);

    const response: ApiResponse = {
      success: false,
      message: '注册失败，请稍后重试',
      status:500
    };

    return NextResponse.json(response);
  }
}
