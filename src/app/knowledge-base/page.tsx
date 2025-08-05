
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Eye, Edit, Trash2 } from "lucide-react";

const mockEntries = [
  { id: 'K001', name: '3D Printing Material Guide', category: 'Manufacturing', tags: ['PLA', 'ABS', 'Resin'] },
  { id: 'K002', name: 'Standard Supply Chain Terms', category: 'Logistics', tags: ['FOB', 'CIF', 'EXW'] },
  { id: 'K003', name: 'Color Theory for Designers', category: 'Design Principles', tags: ['Analogous', 'Complementary'] },
  { id: 'K004', name: 'Software Dev Contract Template', category: 'Legal', tags: ['Contract', 'SOW'] },
];

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Knowledge Base Management</h1>
        <p className="text-muted-foreground">Curate and manage the knowledge that powers the platform's AI.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search entries..." className="pl-10" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter by Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>Manufacturing</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Logistics</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Design</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Legal</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {entry.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
