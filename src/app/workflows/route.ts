/**
 * 工作流 API 路由
 * GET: 获取所有工作流
 * POST: 添加工作流
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isServerStorage } from '@/lib/storage.types';

// 获取所有工作流
export async function GET() {
  if (!isServerStorage()) {
    return NextResponse.json({ 
      success: false, 
      error: 'D1 storage not enabled' 
    }, { status: 400 });
  }

  try {
    const workflows = await db.getAllWorkflows();
    return NextResponse.json({ 
      success: true, 
      workflows 
    });
  } catch (error) {
    console.error('Failed to get workflows:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get workflows' 
    }, { status: 500 });
  }
}

// 添加工作流
export async function POST(request: NextRequest) {
  if (!isServerStorage()) {
    return NextResponse.json({ 
      success: false, 
      error: 'D1 storage not enabled' 
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { userId, ...workflowData } = body;

    if (!workflowData.title || !workflowData.description || !workflowData.category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: title, description, category' 
      }, { status: 400 });
    }

    const workflow = await db.addWorkflow({
      title: workflowData.title,
      description: workflowData.description,
      detail: workflowData.detail,
      category: workflowData.category,
      complexity: workflowData.complexity || 'beginner',
      images: workflowData.images || [],
      workflowJson: workflowData.workflowJson,
      downloadUrl: workflowData.downloadUrl,
      isCustom: workflowData.isCustom !== false,
      author: workflowData.author,
    }, userId);

    return NextResponse.json({ 
      success: true, 
      workflow 
    });
  } catch (error) {
    console.error('Failed to add workflow:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add workflow' 
    }, { status: 500 });
  }
}
