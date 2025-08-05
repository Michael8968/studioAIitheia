
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { List, Upload, User, Edit, PlusCircle, Download, FileOutput } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DataProcessor } from '@/components/features/data-processor';
import { useAuthStore } from '@/store/auth';

const initialSupplierInfo = [
    { id: 'info-1', key: '公司名称', value: '创新科技' },
    { id: 'info-2', key: '联系人', value: '李经理' },
    { id: 'info-3', key: '联系电话', value: '138-8888-8888' },
    { id: 'info-4', key: '行业', value: '消费电子' },
    { id: 'info-5', key: '主要产品', value: '智能家居设备, 可穿戴设备' },
];

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
    const { role } = useAuthStore();
    const [supplierInfo, setSupplierInfo] = useState(initialSupplierInfo);
    const [newFieldKey, setNewFieldKey] = useState('');
    const [newFieldValue, setNewFieldValue] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddField = () => {
        if (newFieldKey && newFieldValue) {
            setSupplierInfo([
                ...supplierInfo,
                {
                    id: `info-${Date.now()}`,
                    key: newFieldKey,
                    value: newFieldValue,
                },
            ]);
            setNewFieldKey('');
            setNewFieldValue('');
            setIsDialogOpen(false);
        }
    };
    
    const isAdmin = role === 'admin';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">供应商中心</h1>
        <p className="text-muted-foreground">在此管理供应商信息，或进行批量导入导出操作。</p>
      </div>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="basic-info"><User className="mr-2 h-4 w-4" />基本信息</TabsTrigger>
          <TabsTrigger value="products-services"><List className="mr-2 h-4 w-4" />商品/服务</TabsTrigger>
          {isAdmin && <TabsTrigger value="bulk-processing"><Upload className="mr-2 h-4 w-4" />批量处理</TabsTrigger>}
        </TabsList>

        <TabsContent value="basic-info" className="mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>供应商基本信息</CardTitle>
                        <CardDescription>管理您的公司档案，这些信息将有助于AI更好地理解您的业务。</CardDescription>
                    </div>
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                添加新字段
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>添加新信息字段</DialogTitle>
                            <DialogDescription>
                                在这里添加自定义字段以完善您的公司信息。
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="field-key" className="text-right">
                                    字段名
                                    </Label>
                                    <Input 
                                        id="field-key" 
                                        value={newFieldKey}
                                        onChange={(e) => setNewFieldKey(e.target.value)}
                                        placeholder="例如：认证资质" 
                                        className="col-span-3" 
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="field-value" className="text-right">
                                    字段值
                                    </Label>
                                    <Input 
                                        id="field-value" 
                                        value={newFieldValue}
                                        onChange={(e) => setNewFieldValue(e.target.value)}
                                        placeholder="例如：ISO9001" 
                                        className="col-span-3" 
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddField}>保存</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">字段</TableHead>
                                <TableHead>值</TableHead>
                                <TableHead className="text-right w-[100px]">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {supplierInfo.map(info => (
                                <TableRow key={info.id}>
                                    <TableCell className="font-medium">{info.key}</TableCell>
                                    <TableCell className="text-muted-foreground">{info.value}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="products-services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>我的产品</CardTitle>
              <CardDescription>在这里添加、编辑和管理您的所有产品信息。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
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
        {isAdmin && 
            <TabsContent value="bulk-processing" className="mt-4">
               <DataProcessor />
            </TabsContent>
        }
      </Tabs>
    </div>
  )
}
