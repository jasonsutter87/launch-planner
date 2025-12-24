import { NextRequest, NextResponse } from "next/server";
import {
  getGoals,
  getGoalsByProduct,
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    const goals = await getGoalsByProduct(productId);
    return NextResponse.json(goals);
  }

  const goals = await getGoals();
  return NextResponse.json(goals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const goal = await createGoal(body);
  return NextResponse.json(goal, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;
  const goal = await updateGoal(id, updates);
  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }
  return NextResponse.json(goal);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  const success = await deleteGoal(id);
  if (!success) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
