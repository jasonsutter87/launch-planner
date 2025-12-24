import { getStore } from "@netlify/blobs";
import { Product, Goal, Lead } from "./types";

const PRODUCTS_KEY = "products";
const GOALS_KEY = "goals";
const LEADS_KEY = "leads";

function getProductStore() {
  return getStore({ name: "launch-planner", consistency: "strong" });
}

// Products
export async function getProducts(): Promise<Product[]> {
  const store = getProductStore();
  const data = await store.get(PRODUCTS_KEY, { type: "json" });
  return (data as Product[]) || [];
}

export async function saveProducts(products: Product[]): Promise<void> {
  const store = getProductStore();
  await store.setJSON(PRODUCTS_KEY, products);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> {
  const products = await getProducts();
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;

  await saveProducts(filtered);
  // Also delete associated goals and leads
  const goals = await getGoals();
  await saveGoals(goals.filter((g) => g.productId !== id));
  const leads = await getLeads();
  await saveLeads(leads.filter((l) => l.productId !== id));
  return true;
}

// Goals
export async function getGoals(): Promise<Goal[]> {
  const store = getProductStore();
  const data = await store.get(GOALS_KEY, { type: "json" });
  return (data as Goal[]) || [];
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  const store = getProductStore();
  await store.setJSON(GOALS_KEY, goals);
}

export async function getGoalsByProduct(productId: string): Promise<Goal[]> {
  const goals = await getGoals();
  return goals.filter((g) => g.productId === productId);
}

export async function createGoal(
  goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "currentCount">
): Promise<Goal> {
  const goals = await getGoals();
  const now = new Date().toISOString();
  const newGoal: Goal = {
    ...goal,
    id: crypto.randomUUID(),
    currentCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  goals.push(newGoal);
  await saveGoals(goals);
  return newGoal;
}

export async function updateGoal(
  id: string,
  updates: Partial<Goal>
): Promise<Goal | null> {
  const goals = await getGoals();
  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) return null;

  goals[index] = {
    ...goals[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveGoals(goals);
  return goals[index];
}

export async function deleteGoal(id: string): Promise<boolean> {
  const goals = await getGoals();
  const filtered = goals.filter((g) => g.id !== id);
  if (filtered.length === goals.length) return false;
  await saveGoals(filtered);
  return true;
}

// Leads
export async function getLeads(): Promise<Lead[]> {
  const store = getProductStore();
  const data = await store.get(LEADS_KEY, { type: "json" });
  return (data as Lead[]) || [];
}

export async function saveLeads(leads: Lead[]): Promise<void> {
  const store = getProductStore();
  await store.setJSON(LEADS_KEY, leads);
}

export async function getLeadsByProduct(productId: string): Promise<Lead[]> {
  const leads = await getLeads();
  return leads.filter((l) => l.productId === productId);
}

export async function createLead(
  lead: Omit<Lead, "id" | "createdAt">
): Promise<Lead> {
  const leads = await getLeads();
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  leads.push(newLead);
  await saveLeads(leads);
  return newLead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  await saveLeads(filtered);
  return true;
}

export function leadsToCSV(leads: Lead[]): string {
  const headers = ["ID", "Product ID", "Email", "Name", "Source", "Created At"];
  const rows = leads.map((l) => [
    l.id,
    l.productId,
    l.email,
    l.name || "",
    l.source || "",
    l.createdAt,
  ]);
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}
