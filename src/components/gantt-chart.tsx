"use client";

import { useEffect, useRef } from "react";
import { Product } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface GanttChartProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const STATUS_COLORS: Record<string, string> = {
  planning: "#94a3b8",
  "in-progress": "#3b82f6",
  launched: "#22c55e",
};

export function GanttChart({ products, onProductClick }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || products.length === 0) return;

    const loadGantt = async () => {
      // @ts-expect-error - frappe-gantt has no types
      const Gantt = (await import("frappe-gantt")).default;

      // Clear previous chart
      containerRef.current!.innerHTML = "";

      const tasks = products.map((p) => ({
        id: p.id,
        name: p.name,
        start: p.startDate,
        end: p.endDate,
        progress: p.status === "launched" ? 100 : p.status === "in-progress" ? 50 : 0,
        custom_class: `status-${p.status}`,
      }));

      new Gantt(containerRef.current, tasks, {
        view_mode: "Month",
        date_format: "YYYY-MM-DD",
        on_click: (task: { id: string }) => {
          const product = products.find((p) => p.id === task.id);
          if (product && onProductClick) {
            onProductClick(product);
          }
        },
        custom_popup_html: (task: { id: string }) => {
          const product = products.find((p) => p.id === task.id);
          if (!product) return "";
          return `
            <div class="p-3">
              <h3 class="font-bold text-lg">${product.name}</h3>
              <p class="text-sm text-gray-600">${product.description}</p>
              <div class="mt-2 text-sm">
                <span class="font-medium">Target:</span> ${product.targetQuarter} ${product.targetYear}
              </div>
              <div class="text-sm">
                <span class="font-medium">Status:</span> ${product.status}
              </div>
              <div class="text-sm">
                ${format(parseISO(product.startDate), "MMM d")} - ${format(parseISO(product.endDate), "MMM d, yyyy")}
              </div>
            </div>
          `;
        },
      });
    };

    loadGantt();
  }, [products, onProductClick]);

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No products yet. Add one to see the timeline.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <style jsx global>{`
        .gantt .bar-wrapper .bar {
          fill: #3b82f6;
        }
        .gantt .bar-wrapper .bar.status-planning {
          fill: ${STATUS_COLORS.planning};
        }
        .gantt .bar-wrapper .bar.status-in-progress {
          fill: ${STATUS_COLORS["in-progress"]};
        }
        .gantt .bar-wrapper .bar.status-launched {
          fill: ${STATUS_COLORS.launched};
        }
        .gantt .bar-progress {
          fill: rgba(255, 255, 255, 0.3);
        }
        .gantt-container {
          overflow-x: auto;
        }
      `}</style>
      <div ref={containerRef} className="gantt-container" />
    </div>
  );
}
