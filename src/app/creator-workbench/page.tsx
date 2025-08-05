
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelGenerator } from "@/components/features/model-generator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Milestone, Wand2, Briefcase, FileCheck2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockTasks = [
  { id: 'D001', title: 'Need a custom logo for a new coffee brand', budget: '$500 - $1000', category: 'Graphic Design' },
  { id: 'D003', title: 'Looking for 3D printed prototypes for a new gadget', budget: '$1500 - $2500', category: '3D Modeling' },
  { id: 'D005', title: 'Seeking a supplier for eco-friendly packaging', budget: 'Negotiable', category: 'Sourcing' },
];

const mockSubmissions = [
    { name: 'Sci-Fi Soldier Character', category: '3D Character', price: '$1,200', updated: '2024-07-20' },
    { name: 'Vintage Racing Car', category: '3D Vehicle', price: '$800', updated: '2024-06-15' },
    { name: 'Fantasy Sword Asset', category: 'Game Prop', price: '$150', updated: '2024-05-30' },
];

export default function CreatorWorkbenchPage() {
    const { role } = useAuthStore();

    if (role !== 'creator' && role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>You do not have permission to view this page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.href = '/login'} className="w-full">
                            Return to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Creator Workbench</h1>
        <p className="text-muted-foreground">Manage your tasks, create with AI, and track your submissions.</p>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks"><Briefcase className="mr-2"/> Tasks & Demands</TabsTrigger>
          <TabsTrigger value="ai-creation"><Wand2 className="mr-2"/> 3D AI Creation</TabsTrigger>
          <TabsTrigger value="submissions"><FileCheck2 className="mr-2"/> My Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Tasks</CardTitle>
              <CardDescription>These are open demands that match your skills. Claim one to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Demand Title</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.budget}</TableCell>
                      <TableCell>{task.category}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline"><Milestone className="mr-2 h-4 w-4" /> Accept Task</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-creation" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>3D AI Creation</CardTitle>
                    <CardDescription>Use AI to generate 3D model previews from a text description.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ModelGenerator />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardHeader>
                <CardTitle>My Submissions</CardTitle>
                <CardDescription>A list of your submitted and approved works.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Work Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockSubmissions.map((submission, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{submission.name}</TableCell>
                                <TableCell>{submission.category}</TableCell>
                                <TableCell>{submission.price}</TableCell>
                                <TableCell>{submission.updated}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
