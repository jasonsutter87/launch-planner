export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type ProductStatus = "planning" | "in-progress" | "launched";

export interface Product {
  id: string;
  name: string;
  description: string;
  targetQuarter: Quarter;
  targetYear: number;
  startDate: string;
  endDate: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  productId: string;
  title: string;
  category: string;
  targetCount?: number;
  currentCount: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  productId: string;
  email: string;
  name?: string;
  source?: string;
  createdAt: string;
}

export const GOAL_CATEGORIES = [
  "Marketing",
  "Sales",
  "Development",
  "Content",
  "Community",
  "Partnerships",
  "Other",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];
