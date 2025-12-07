/**
 * 用户注册 API
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STORAGE_TYPE } from '@/lib/storage.types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { username, password, email, inviteCode } = await request.json();

    // 基本验证
    if (!username || !password || !email) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码长度至少6位' },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // D1 模式：使用数据库注册
    if (STORAGE_TYPE === 'd1') {
      // 检查用户名是否已存在
      const existingUser = await db.getUserByUsername(username);
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: '用户名已被使用' },
          { status: 409 }
        );
      }

      // 创建用户（实际应用中应该对密码进行哈希处理）
      const newUser = await db.createUser(username, password, 'user');
      
      if (newUser) {
        return NextResponse.json({
          success: true,
          message: '注册成功，请登录'
        });
      }
      
      return NextResponse.json(
        { success: false, error: '注册失败，请稍后重试' },
        { status: 500 }
      );
    }

    // localStorage 模式：不支持注册（仅管理员通过环境变量配置）
    return NextResponse.json(
      { success: false, error: '当前模式不支持注册' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
