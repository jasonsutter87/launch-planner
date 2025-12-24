import { NextRequest, NextResponse } from "next/server";
import {
  getLeads,
  getLeadsByProduct,
  createLead,
  deleteLead,
  leadsToCSV,
} from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const format = searchParams.get("format");

  let leads;
  if (productId) {
    leads = await getLeadsByProduct(productId);
  } else {
    leads = await getLeads();
  }

  if (format === "csv") {
    const csv = leadsToCSV(leads);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=leads.csv",
      },
    });
  }

  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const lead = await createLead(body);
  return NextResponse.json(lead, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  const success = await deleteLead(id);
  if (!success) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
