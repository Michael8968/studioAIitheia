
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload, Edit, Trash2, Link, Code } from "lucide-react";

const mockLinks = [
  { id: 'L001', name: 'ShadCN UI 文档', url: 'https://ui.shadcn.com', desc: '组件库文档。' },
  { id: 'L002', name: 'Lucide 图标集', url: 'https://lucide.dev', desc: '项目所使用的图标库。' },
];

const mockApis = [
  { id: 'A001', name: 'Stripe API', endpoint: 'https://api.stripe.com', status: '生效中' },
  { id: 'A002', name: 'Google Maps API', endpoint: 'https://maps.googleapis.com', status: '生效中' },
];

export default function PublicResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">公共资源库</h1>
        <p className="text-muted-foreground">管理共享资源，如外部链接和API端点。</p>
      </div>

      <Tabs defaultValue="links">
        <div className="flex justify-between items-start">
            <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="links"><Link className="mr-2"/> 外部链接</TabsTrigger>
                <TabsTrigger value="apis"><Code className="mr-2"/> API端点</TabsTrigger>
            </TabsList>
             <div className="flex gap-2">
                <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> 导入</Button>
                <Button variant="outline"><Download className="mr-2 h-4 w-4"/> 导出</Button>
            </div>
        </div>

        <TabsContent value="links" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>外部链接</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="text-right">操作</TableHead>
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
              <CardTitle>API 端点</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>端点</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
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
