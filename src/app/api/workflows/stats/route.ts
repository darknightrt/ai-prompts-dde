/**
 * 工作流统计 API
 * 用于增加和获取工作流的浏览量和下载量
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STORAGE_TYPE } from '@/lib/storage.types';

/**
 * GET - 获取工作流统计数据
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('id');

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Missing workflow id' },
        { status: 400 }
      );
    }

    // 仅在 D1 模式下可用
    if (STORAGE_TYPE !== 'd1') {
      return NextResponse.json(
        { views: 0, downloads: 0, source: 'localstorage' },
        { status: 200 }
      );
    }

    const stats = await db.getWorkflowStats(workflowId);
    return NextResponse.json({ ...stats, source: 'd1' });
  } catch (error) {
    console.error('Failed to get workflow stats:', error);
    return NextResponse.json(
      { error: 'Failed to get workflow stats' },
      { status: 500 }
    );
  }
}

/**
 * POST - 增加工作流统计数据
 * body: { id: string, type: 'view' | 'download' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type } = body;

    if (!id || !type) {
      return NextResponse.json(
        { error: 'Missing id or type' },
        { status: 400 }
      );
    }

    if (type !== 'view' && type !== 'download') {
      return NextResponse.json(
        { error: 'Invalid type, must be "view" or "download"' },
        { status: 400 }
      );
    }

    // 仅在 D1 模式下可用
    if (STORAGE_TYPE !== 'd1') {
      return NextResponse.json(
        { success: true, count: 0, source: 'localstorage' },
        { status: 200 }
      );
    }

    let count: number;
    if (type === 'view') {
      count = await db.incrementWorkflowViews(id);
    } else {
      count = await db.incrementWorkflowDownloads(id);
    }

    return NextResponse.json({ success: true, count, source: 'd1' });
  } catch (error) {
    console.error('Failed to update workflow stats:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow stats' },
      { status: 500 }
    );
  }
}
