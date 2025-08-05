
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, PlusCircle, List, Upload } from 'lucide-react';
import Image from 'next/image';
import { DataProcessor } from '@/components/features/data-processor';

const mockProducts = [
  { id: 'prod-1', name: '环保咖啡杯', status: '已上架', stock: 1500, imageUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'coffee cup' },
  { id: 'prod-2', name: '智能LED灯泡', status: '已上架', stock: 800, imageUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'led bulb' },
  { id: 'prod-3', name: '有机棉T恤-白色', status: '审核中', stock: 0, imageUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'white t-shirt' },
  { id: 'prod-4', name: '天然手工皂', status: '库存低', stock: 45, imageUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'handmade soap' },
  { id: 'prod-5', name: '定制化宠物项圈', status: '草稿', stock: 0, imageUrl: 'https://placehold.co/40x40.png', 'data-ai-hint': 'pet collar' },
];

const statusVariantMap: { [key: string]: 'secondary' | 'outline' | 'default' | 'destructive' } = {
  '已上架': 'secondary',
  '审核中': 'default',
  '草稿': 'outline',
  '库存低': 'destructive',
};


export default function SupplierCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">供应商中心</h1>
        <p className="text-muted-foreground">管理您的产品数据，为AI智能分析和前端展示提供数据源。</p>
      </div>
      <Tabs defaultValue="product-management" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="product-management"><List className="mr-2 h-4 w-4" />产品数据管理</TabsTrigger>
          <TabsTrigger value="bulk-import"><Upload className="mr-2 h-4 w-4" />批量数据导入</TabsTrigger>
        </TabsList>
        <TabsContent value="product-management" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>我的产品</CardTitle>
              <CardDescription>在这里添加、编辑和管理您的所有产品信息。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索产品..." className="pl-8" />
                </div>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  添加新产品
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">图片</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>库存</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                            data-ai-hint={product['data-ai-hint']}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariantMap[product.status]}>{product.status}</Badge>
                        </TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">编辑</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulk-import" className="mt-4">
           <DataProcessor />
        </TabsContent>
      </Tabs>
    </div>
  )
}
