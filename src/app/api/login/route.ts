import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { ApiResponse } from '@/types/api';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponseData {
  id: string;
  username: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // 验证用户名
    if (!username || typeof username !== 'string') {
      const response: ApiResponse = {
        success: false,
        message: '用户名不能为空',
        status:400
      };
      return NextResponse.json(response);
    }

    // 验证密码
    if (!password || typeof password !== 'string') {
      const response: ApiResponse = {
        success: false,
        message: '密码不能为空',
        status:400
      };
      return NextResponse.json(response);
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: '用户名或密码错误',
        status:401
      };
      return NextResponse.json(response);
    }

    // 验证密码
    if (user.password !== password) {
      const response: ApiResponse = {
        success: false,
        message: '用户名或密码错误',
        status:401
      };
      return NextResponse.json(response);
    }

    const response: ApiResponse<LoginResponseData> = {
      success: true,
      message: '登录成功',
      data: {
        id: user._id.toString(),
        username: user.username,
      },
      status:200
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('登录错误:', error);

    const response: ApiResponse = {
      success: false,
      message: '登录失败，请稍后重试',
      status:500
    };

    return NextResponse.json(response);
  }
}
