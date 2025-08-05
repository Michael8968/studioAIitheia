
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Ban } from "lucide-react";

const mockPrompts = [
  { id: 'userProfilePrompt', name: 'User Profile Generator', scope: 'Shopping Assistant', status: 'Active' },
  { id: 'productRecommendationsPrompt', name: 'Product Recommender', scope: 'Shopping Assistant', status: 'Active' },
  { id: 'evaluateSellerDataPrompt', name: 'Seller Data Evaluator', scope: 'Supplier Center', status: 'Active' },
  { id: 'generate3DModelPrompt', name: '3D Model Generator', scope: 'Creator Workbench', status: 'Active' },
];

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Prompt Management</h1>
        <p className="text-muted-foreground">View and manage the AI prompts used throughout the application.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prompt Name</TableHead>
                <TableHead>Prompt ID</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.name}</TableCell>
                  <TableCell className="font-mono text-xs">{prompt.id}</TableCell>
                  <TableCell>{prompt.scope}</TableCell>
                  <TableCell>
                    <Badge variant={prompt.status === 'Active' ? 'default' : 'destructive'} className={prompt.status === 'Active' ? 'bg-green-500' : ''}>{prompt.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled><Ban className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
