/**
 * 单个工作流 API 路由
 * GET: 获取单个工作流
 * PUT: 更新工作流
 * DELETE: 删除工作流
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isServerStorage } from '@/lib/storage.types';

// 获取单个工作流
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isServerStorage()) {
    return NextResponse.json({ 
      success: false, 
      error: 'D1 storage not enabled' 
    }, { status: 400 });
  }

  try {
    const { id } = await params;
    const workflow = await db.getWorkflowById(id);
    
    if (!workflow) {
      return NextResponse.json({ 
        success: false, 
        error: 'Workflow not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      workflow 
    });
  } catch (error) {
    console.error('Failed to get workflow:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get workflow' 
    }, { status: 500 });
  }
}

// 更新工作流
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isServerStorage()) {
    return NextResponse.json({ 
      success: false, 
      error: 'D1 storage not enabled' 
    }, { status: 400 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const success = await db.updateWorkflow(id, body);
    
    if (!success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update workflow' 
      }, { status: 500 });
    }

    // 获取更新后的工作流
    const workflow = await db.getWorkflowById(id);

    return NextResponse.json({ 
      success: true, 
      workflow 
    });
  } catch (error) {
    console.error('Failed to update workflow:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update workflow' 
    }, { status: 500 });
  }
}

// 删除工作流
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isServerStorage()) {
    return NextResponse.json({ 
      success: false, 
      error: 'D1 storage not enabled' 
    }, { status: 400 });
  }

  try {
    const { id } = await params;
    const success = await db.deleteWorkflows([id]);
    
    if (!success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete workflow' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true 
    });
  } catch (error) {
    console.error('Failed to delete workflow:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete workflow' 
    }, { status: 500 });
  }
}
