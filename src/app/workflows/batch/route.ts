/**
 * 工作流批量操作 API 路由
 * POST: 批量导入工作流
 * DELETE: 批量删除工作流
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isServerStorage } from '@/lib/storage.types';

// 批量删除工作流
export async function DELETE(request: NextRequest) {
  if (!isServerStorage()) {
    return NextResponse.json({ 
      success: false, 
      error: 'D1 storage not enabled' 
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing or invalid ids array' 
      }, { status: 400 });
    }

    const success = await db.deleteWorkflows(ids);

    if (!success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete workflows' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      deleted: ids.length 
    });
  } catch (error) {
    console.error('DELETE /api/workflows/batch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete workflows' 
    }, { status: 500 });
  }
}

// 批量导入工作流
export async function POST(request: NextRequest) {
  if (!isServerStorage()) {
    return NextResponse.json({ 
      success: false, 
      error: 'D1 storage not enabled' 
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { workflows, userId, isInitialData } = body;

    if (!workflows || !Array.isArray(workflows) || workflows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing or invalid workflows array' 
      }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const workflow of workflows) {
      try {
        const newWorkflow = await db.addWorkflow({
          title: workflow.title,
          description: workflow.description,
          detail: workflow.detail,
          category: workflow.category || 'other',
          complexity: workflow.complexity || 'beginner',
          images: workflow.images || [],
          workflowJson: workflow.workflowJson,
          downloadUrl: workflow.downloadUrl,
          // 初始化数据不显示"新建"标签，用户导入的数据显示"新建"标签
          isCustom: isInitialData ? false : true,
          author: workflow.author,
        }, userId);
        results.push(newWorkflow);
      } catch (e) {
        errors.push({ workflow: workflow.title, error: String(e) });
      }
    }

    return NextResponse.json({ 
      success: true, 
      imported: results.length,
      errors: errors.length > 0 ? errors : undefined 
    });
  } catch (error) {
    console.error('POST /api/workflows/batch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to import workflows' 
    }, { status: 500 });
  }
}
