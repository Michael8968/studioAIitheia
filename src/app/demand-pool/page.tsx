
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Trash2, Milestone, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";

const mockDemands = [
  { id: 'D001', title: 'Need a custom logo for a new coffee brand', budget: '$500 - $1000', category: 'Graphic Design', status: 'Open', created: '2024-08-01' },
  { id: 'D002', title: 'Develop a mobile app for pet sitting services', budget: '$8000 - $12000', category: 'Software Development', status: 'In Progress', created: '2024-07-28' },
  { id: 'D003', title: 'Looking for 3D printed prototypes for a new gadget', budget: '$1500 - $2500', category: '3D Modeling', status: 'Open', created: '2024-07-25' },
  { id: 'D004', title: 'Professional translation of a website (EN to ZH)', budget: '$800 - $1200', category: 'Translation', status: 'Completed', created: '2024-07-15' },
  { id: 'D005', title: 'Seeking a supplier for eco-friendly packaging', budget: 'Negotiable', category: 'Sourcing', status: 'Open', created: '2024-08-05' },
];

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Open': 'default',
  'In Progress': 'secondary',
  'Completed': 'outline',
};

function DemandFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Publish New Demand
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish New Demand</DialogTitle>
          <DialogDescription>
            Fill in the details of your demand. It will be visible to relevant creators and suppliers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" placeholder="e.g., Custom logo design" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" placeholder="e.g., Graphic Design" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">Budget</Label>
            <Input id="budget" placeholder="e.g., $500 - $1000" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" placeholder="Describe your needs in detail..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit Demand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DemandPoolPage() {
  const { role } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Demand Pool</h1>
          <p className="text-muted-foreground">Browse, claim, or publish demands in the ecosystem.</p>
        </div>
        {role === 'user' && <DemandFormDialog />}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by title or tags..." className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Category</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Status</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Demand Title</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDemands.map((demand) => (
                <TableRow key={demand.id}>
                  <TableCell className="font-medium">{demand.title}</TableCell>
                  <TableCell>{demand.budget}</TableCell>
                  <TableCell>{demand.category}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[demand.status] || 'default'}>{demand.status}</Badge>
                  </TableCell>
                  <TableCell>{demand.created}</TableCell>
                  <TableCell className="text-right">
                    {role === 'admin' && (
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    )}
                    {(role === 'supplier' || role === 'creator') && demand.status === 'Open' && (
                      <Button variant="outline" size="sm"><Milestone className="mr-2 h-4 w-4" />Claim</Button>
                    )}
                     {(role === 'supplier' || role === 'creator') && demand.status !== 'Open' && (
                      <Button variant="outline" size="sm" disabled><Phone className="mr-2 h-4 w-4" />Contact</Button>
                    )}
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
