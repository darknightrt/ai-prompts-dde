/**
 * 批量操作 API 路由
 * 支持批量删除、批量导入
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STORAGE_TYPE } from '@/lib/storage.types';

export const runtime = 'edge';

// 批量删除
export async function DELETE(request: NextRequest) {
  try {
    if (STORAGE_TYPE !== 'd1') {
      return NextResponse.json(
        { error: 'This API is only available in D1 storage mode' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids array', success: false },
        { status: 400 }
      );
    }

    const success = await db.deletePrompts(ids);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete prompts', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      deleted: ids.length 
    });
  } catch (error) {
    console.error('DELETE /api/prompts/batch error:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompts', success: false },
      { status: 500 }
    );
  }
}

// 批量导入
export async function POST(request: NextRequest) {
  try {
    if (STORAGE_TYPE !== 'd1') {
      return NextResponse.json(
        { error: 'This API is only available in D1 storage mode' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { prompts, userId } = body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid prompts array', success: false },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const prompt of prompts) {
      try {
        const newPrompt = await db.addPrompt({
          title: prompt.title,
          desc: prompt.desc,
          prompt: prompt.prompt,
          category: prompt.category || 'custom',
          complexity: prompt.complexity || 'beginner',
          type: 'text',
          tags: prompt.tags,
          isCustom: true,
        }, userId);
        results.push(newPrompt);
      } catch (e) {
        errors.push({ prompt: prompt.title, error: String(e) });
      }
    }

    return NextResponse.json({ 
      success: true, 
      imported: results.length,
      errors: errors.length > 0 ? errors : undefined 
    });
  } catch (error) {
    console.error('POST /api/prompts/batch error:', error);
    return NextResponse.json(
      { error: 'Failed to import prompts', success: false },
      { status: 500 }
    );
  }
}
