/**
 * 用户登录 API
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STORAGE_TYPE } from '@/lib/storage.types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // D1 模式：使用数据库验证
    if (STORAGE_TYPE === 'd1') {
      const user = await db.verifyUser(username, password);
      
      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            avatar: user.avatar
          }
        });
      }
      
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // localStorage 模式：使用环境变量或默认管理员账号
    const Username = process.env.USERNAME || 'admin';
    const Password = process.env.PASSWORD || '123789';

    if (username === Username && password === Password) {
      return NextResponse.json({
        success: true,
        user: {
          id: 0,
          username: Username,
          role: 'admin',
          avatar: null
        }
      });
    }

    return NextResponse.json(
      { success: false, error: '用户名或密码错误' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
