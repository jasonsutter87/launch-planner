"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "@/components/product-form";
import { GoalTracker } from "@/components/goal-tracker";
import { LeadManager } from "@/components/lead-form";
import { Product, Goal, Lead } from "@/lib/types";
import { format, parseISO } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  launched: "bg-green-100 text-green-800",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const productId = params.id as string;

  const fetchData = useCallback(async () => {
    const [productsRes, goalsRes, leadsRes] = await Promise.all([
      fetch("/api/products"),
      fetch(`/api/goals?productId=${productId}`),
      fetch(`/api/leads?productId=${productId}`),
    ]);

    const products = await productsRes.json();
    const foundProduct = products.find((p: Product) => p.id === productId);
    setProduct(foundProduct || null);
    setGoals(await goalsRes.json());
    setLeads(await leadsRes.json());
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProduct = async (data: Partial<Product>) => {
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchData();
  };

  const handleDeleteProduct = async () => {
    if (!confirm("Delete this product and all its goals/leads?")) return;
    await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
    router.push("/");
  };

  // Goal handlers
  const handleCreateGoal = async (goal: Partial<Goal>) => {
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });
    fetchData();
  };

  const handleUpdateGoal = async (id: string, updates: Partial<Goal>) => {
    await fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchData();
  };

  const handleDeleteGoal = async (id: string) => {
    await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  // Lead handlers
  const handleCreateLead = async (lead: Partial<Lead>) => {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    fetchData();
  };

  const handleDeleteLead = async (id: string) => {
    await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleExportCSV = () => {
    window.open(`/api/leads?productId=${productId}&format=csv`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link href="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <Badge className={STATUS_COLORS[product.status]}>
                  {product.status.replace("-", " ")}
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">{product.description}</p>
            </div>
            <div className="flex gap-2">
              <ProductForm
                product={product}
                onSubmit={handleUpdateProduct}
                trigger={<Button variant="outline">Edit</Button>}
              />
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Target</span>
                <div className="text-lg">
                  {product.targetQuarter} {product.targetYear}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Start Date</span>
                <div className="text-lg">
                  {format(parseISO(product.startDate), "MMM d, yyyy")}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">End Date</span>
                <div className="text-lg">
                  {format(parseISO(product.endDate), "MMM d, yyyy")}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status</span>
                <div className="text-lg capitalize">{product.status.replace("-", " ")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="goals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="goals">
              Goals ({goals.filter((g) => g.completed).length}/{goals.length})
            </TabsTrigger>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="goals">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <GoalTracker
                goals={goals}
                productId={productId}
                onCreateGoal={handleCreateGoal}
                onUpdateGoal={handleUpdateGoal}
                onDeleteGoal={handleDeleteGoal}
              />
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <LeadManager
              leads={leads}
              productId={productId}
              onCreateLead={handleCreateLead}
              onDeleteLead={handleDeleteLead}
              onExportCSV={handleExportCSV}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
