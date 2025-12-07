/**
 * 获取用户数量 API
 * GET /api/admin/user-count
 * 
 * 注意：此 API 仅在 D1 模式下返回真实数据
 * localStorage 模式下用户数据存储在客户端，无法统计
 */

import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_TYPE } from '@/lib/storage.types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // D1 模式：从数据库获取用户数量
    if (STORAGE_TYPE === 'd1') {
      const db = (process.env as unknown as { DB: any }).DB;
      
      if (!db) {
        return NextResponse.json({ count: 0 });
      }
      
      const result = await db.prepare('SELECT COUNT(*) as count FROM users').first();
      return NextResponse.json({ count: result?.count || 0 });
    }
    
    // localStorage 模式：返回 1（仅管理员）
    return NextResponse.json({ count: 1 });
    
  } catch (error) {
    console.error('Failed to get user count:', error);
    return NextResponse.json({ count: 0 });
  }
}
