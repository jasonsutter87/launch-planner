"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal, GOAL_CATEGORIES } from "@/lib/types";

interface GoalTrackerProps {
  goals: Goal[];
  productId: string;
  onCreateGoal: (goal: Partial<Goal>) => Promise<void>;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
}

export function GoalTracker({
  goals,
  productId,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
}: GoalTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    category: "Marketing",
    targetCount: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateGoal({
      productId,
      title: newGoal.title,
      category: newGoal.category,
      targetCount: newGoal.targetCount ? parseInt(newGoal.targetCount) : undefined,
      completed: false,
    });
    setNewGoal({ title: "", category: "Marketing", targetCount: "" });
    setShowForm(false);
  };

  const incrementCount = async (goal: Goal) => {
    const newCount = goal.currentCount + 1;
    const completed = goal.targetCount ? newCount >= goal.targetCount : false;
    await onUpdateGoal(goal.id, { currentCount: newCount, completed });
  };

  const toggleComplete = async (goal: Goal) => {
    await onUpdateGoal(goal.id, { completed: !goal.completed });
  };

  const getProgress = (goal: Goal) => {
    if (!goal.targetCount) return goal.completed ? 100 : 0;
    return Math.min(100, (goal.currentCount / goal.targetCount) * 100);
  };

  const groupedGoals = goals.reduce(
    (acc, goal) => {
      if (!acc[goal.category]) acc[goal.category] = [];
      acc[goal.category].push(goal);
      return acc;
    },
    {} as Record<string, Goal[]>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Goals</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Goal"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="p-4 border rounded-lg space-y-3">
          <Input
            placeholder="Goal title (e.g., 'Create 5 reddit posts')"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <Select
              value={newGoal.category}
              onValueChange={(v) => setNewGoal({ ...newGoal, category: v })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Target (optional)"
              value={newGoal.targetCount}
              onChange={(e) =>
                setNewGoal({ ...newGoal, targetCount: e.target.value })
              }
              className="w-32"
              min={1}
            />
            <Button type="submit">Add</Button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">
          No goals yet. Add some to track your progress!
        </p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
            <Card key={category}>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 rounded-lg border ${
                      goal.completed ? "bg-green-50 border-green-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={goal.completed}
                            onChange={() => toggleComplete(goal)}
                            className="w-4 h-4"
                          />
                          <span
                            className={
                              goal.completed ? "line-through text-gray-500" : ""
                            }
                          >
                            {goal.title}
                          </span>
                        </div>
                        {goal.targetCount && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={getProgress(goal)} className="flex-1" />
                              <span className="text-sm text-gray-600">
                                {goal.currentCount}/{goal.targetCount}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => incrementCount(goal)}
                                disabled={goal.completed}
                              >
                                +1
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDeleteGoal(goal.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {goals.length > 0 && (
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">
            {goals.filter((g) => g.completed).length}/{goals.length} completed
          </Badge>
        </div>
      )}
    </div>
  );
}
