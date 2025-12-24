"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface LeadFormProps {
  leads: Lead[];
  productId: string;
  onCreateLead: (lead: Partial<Lead>) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  onExportCSV: () => void;
}

export function LeadManager({
  leads,
  productId,
  onCreateLead,
  onDeleteLead,
  onExportCSV,
}: LeadFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [newLead, setNewLead] = useState({
    email: "",
    name: "",
    source: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateLead({
      productId,
      email: newLead.email,
      name: newLead.name || undefined,
      source: newLead.source || undefined,
    });
    setNewLead({ email: "", name: "", source: "" });
    setShowForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leads ({leads.length})</CardTitle>
          <div className="flex gap-2">
            {leads.length > 0 && (
              <Button size="sm" variant="outline" onClick={onExportCSV}>
                Export CSV
              </Button>
            )}
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ Add Lead"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleCreate} className="mb-4 p-4 border rounded-lg space-y-3">
            <Input
              type="email"
              placeholder="Email (required)"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <Input
                placeholder="Name (optional)"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              />
              <Input
                placeholder="Source (e.g., Twitter, Reddit)"
                value={newLead.source}
                onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
              />
            </div>
            <Button type="submit">Add Lead</Button>
          </form>
        )}

        {leads.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">
            No leads captured yet. Start collecting interest!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.name || "-"}</TableCell>
                  <TableCell>{lead.source || "-"}</TableCell>
                  <TableCell>
                    {format(parseISO(lead.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteLead(lead.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
