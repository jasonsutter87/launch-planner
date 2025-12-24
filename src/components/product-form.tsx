"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product, Quarter, ProductStatus } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  trigger?: React.ReactNode;
}

const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
const STATUSES: ProductStatus[] = ["planning", "in-progress", "launched"];

export function ProductForm({ product, onSubmit, trigger }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    targetQuarter: product?.targetQuarter || "Q2",
    targetYear: product?.targetYear || new Date().getFullYear() + 1,
    startDate: product?.startDate || "",
    endDate: product?.endDate || "",
    status: product?.status || "planning",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        id: product?.id,
      });
      setOpen(false);
      if (!product) {
        setFormData({
          name: "",
          description: "",
          targetQuarter: "Q2",
          targetYear: new Date().getFullYear() + 1,
          startDate: "",
          endDate: "",
          status: "planning",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{product ? "Edit" : "Add Product"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Product name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Target Quarter</label>
              <Select
                value={formData.targetQuarter}
                onValueChange={(v) =>
                  setFormData({ ...formData, targetQuarter: v as Quarter })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUARTERS.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Target Year</label>
              <Input
                type="number"
                value={formData.targetYear}
                onChange={(e) =>
                  setFormData({ ...formData, targetYear: parseInt(e.target.value) })
                }
                min={2024}
                max={2030}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status}
              onValueChange={(v) =>
                setFormData({ ...formData, status: v as ProductStatus })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : product ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
