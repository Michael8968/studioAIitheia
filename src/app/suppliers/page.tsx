
'use client';

import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataProcessor } from "@/components/features/data-processor";
import { User, List, UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SuppliersPage() {
    const { role } = useAuthStore();

    if (role !== 'supplier' && role !== 'admin') {
         return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>访问受限</CardTitle>
                        <CardDescription>您没有权限访问此页面。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.href = '/login'} className="w-full">
                            返回登录
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">供应商中心</h1>
                <p className="text-muted-foreground">管理您的公司信息、产品和服务。</p>
            </div>
            <Tabs defaultValue="info" className="w-full">
                <TabsList className={`grid w-full ${role === 'admin' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <TabsTrigger value="info"><User className="mr-2"/> 基本信息</TabsTrigger>
                    <TabsTrigger value="products"><List className="mr-2"/> 商品/服务</TabsTrigger>
                    {role === 'admin' && (
                         <TabsTrigger value="batch"><UploadCloud className="mr-2"/> 批量处理</TabsTrigger>
                    )}
                </TabsList>
                <TabsContent value="info" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>基本信息</CardTitle>
                            <CardDescription>保持您的公司档案最新。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">公司名称</Label>
                                    <Input id="companyName" defaultValue="创新科技有限公司"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">联系人</Label>
                                    <Input id="contactPerson" defaultValue="李先生"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry">所属行业</Label>
                                    <Input id="industry" defaultValue="电子制造"/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="foundedDate">成立日期</Label>
                                    <Input id="foundedDate" type="date" defaultValue="2010-01-15"/>
                                </div>
                               <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label htmlFor="companyBio">公司简介</Label>
                                    <Textarea id="companyBio" defaultValue="一家领先的创新电子元件制造商，拥有超过十年的历史。"/>
                                </div>
                           </div>
                           <div className="flex justify-end">
                                <Button>保存基本信息</Button>
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="products" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>商品 / 服务</CardTitle>
                            <CardDescription>管理您的产品和服务项目。</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground py-12">
                            <p>商品和服务管理功能即将推出。</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                {role === 'admin' && (
                    <TabsContent value="batch" className="mt-4">
                       <DataProcessor />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
