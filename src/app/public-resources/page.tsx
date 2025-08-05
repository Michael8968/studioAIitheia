
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload, Edit, Trash2, Link, Code } from "lucide-react";

const mockLinks = [
  { id: 'L001', name: 'ShadCN UI Docs', url: 'https://ui.shadcn.com', desc: 'Component library documentation.' },
  { id: 'L002', name: 'Lucide Icons', url: 'https://lucide.dev', desc: 'Icon set used in the project.' },
];

const mockApis = [
  { id: 'A001', name: 'Stripe API', endpoint: 'https://api.stripe.com', status: 'Active' },
  { id: 'A002', name: 'Google Maps API', endpoint: 'https://maps.googleapis.com', status: 'Active' },
];

export default function PublicResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Public Resources</h1>
        <p className="text-muted-foreground">Manage shared resources like external links and API endpoints.</p>
      </div>

      <Tabs defaultValue="links">
        <div className="flex justify-between items-start">
            <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="links"><Link className="mr-2"/> External Links</TabsTrigger>
                <TabsTrigger value="apis"><Code className="mr-2"/> API Endpoints</TabsTrigger>
            </TabsList>
             <div className="flex gap-2">
                <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Import</Button>
                <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Export</Button>
            </div>
        </div>

        <TabsContent value="links" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>External Links</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>{link.name}</TableCell>
                      <TableCell><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.url}</a></TableCell>
                      <TableCell>{link.desc}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="mt-4">
          <Card>
             <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockApis.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell>{api.name}</TableCell>
                      <TableCell className="font-mono text-sm">{api.endpoint}</TableCell>
                      <TableCell>{api.status}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
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
