"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { format, parseISO } from "date-fns";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  launched: "bg-green-100 text-green-800",
};

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge className={STATUS_COLORS[product.status]}>
            {product.status.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="text-sm space-y-1 mb-4">
          <div>
            <span className="font-medium">Target:</span> {product.targetQuarter}{" "}
            {product.targetYear}
          </div>
          <div>
            <span className="font-medium">Timeline:</span>{" "}
            {format(parseISO(product.startDate), "MMM d")} -{" "}
            {format(parseISO(product.endDate), "MMM d, yyyy")}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/products/${product.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
          {onEdit && (
            <Button size="sm" variant="ghost" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
