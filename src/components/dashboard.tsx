"use client";

import { useEffect, useState, useCallback } from "react";
import { GanttChart } from "@/components/gantt-chart";
import { ProductForm } from "@/components/product-form";
import { ProductCard } from "@/components/product-card";
import { UserMenu } from "@/components/user-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/lib/types";

interface DashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Dashboard({ user }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = async (data: Partial<Product>) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product and all its goals/leads?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Launch Planner</h1>
          <div className="flex items-center gap-4">
            <ProductForm onSubmit={handleCreateProduct} />
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Product Timeline</h2>
              <GanttChart
                products={products}
                onProductClick={(p) => (window.location.href = `/products/${p.id}`)}
              />
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products yet</p>
                <ProductForm onSubmit={handleCreateProduct} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={() => handleDeleteProduct(product.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {products.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold">
                  {products.filter((p) => p.status === "planning").length}
                </div>
                <div className="text-sm text-gray-500">Planning</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {products.filter((p) => p.status === "in-progress").length}
                </div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {products.filter((p) => p.status === "launched").length}
                </div>
                <div className="text-sm text-gray-500">Launched</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
