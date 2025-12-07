/**
 * 单个提示词 API 路由
 * 支持 GET（获取详情）、PUT（更新）、DELETE（删除）
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { STORAGE_TYPE } from '@/lib/storage.types';

export const runtime = 'edge';

interface RouteParams {
  params: { id: string };
}

// 获取单个提示词
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (STORAGE_TYPE !== 'd1') {
      return NextResponse.json(
        { error: 'This API is only available in D1 storage mode' },
        { status: 400 }
      );
    }

    const prompt = await db.getPromptById(params.id);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ prompt, success: true });
  } catch (error) {
    console.error('GET /api/prompts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt', success: false },
      { status: 500 }
    );
  }
}

// 更新提示词
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (STORAGE_TYPE !== 'd1') {
      return NextResponse.json(
        { error: 'This API is only available in D1 storage mode' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, desc, prompt, category, complexity, tags } = body;

    const success = await db.updatePrompt(params.id, {
      title,
      desc,
      prompt,
      category,
      complexity,
      type: 'text',
      tags,
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update prompt', success: false },
        { status: 500 }
      );
    }

    const updatedPrompt = await db.getPromptById(params.id);
    return NextResponse.json({ prompt: updatedPrompt, success: true });
  } catch (error) {
    console.error('PUT /api/prompts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt', success: false },
      { status: 500 }
    );
  }
}

// 删除提示词
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (STORAGE_TYPE !== 'd1') {
      return NextResponse.json(
        { error: 'This API is only available in D1 storage mode' },
        { status: 400 }
      );
    }

    const success = await db.deletePrompts([params.id]);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete prompt', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/prompts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt', success: false },
      { status: 500 }
    );
  }
}
