
'use client';

import { useState } from 'react';
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataProcessor } from "@/components/features/data-processor";
import { User, List, UploadCloud, PlusCircle, Trash2, Image as ImageIcon, Video, ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SupplementaryField = {
  id: string;
  key: string;
  value: string;
  mapping: string;
};

type MediaField = {
    id: string;
    type: 'image' | 'video';
    file: File | null;
    preview: string;
    mapping: string;
}

type ProductService = {
  id: string;
  name: string;
  description: string;
  price: string;
  sku: string;
  category: string;
  link: string;
  media: MediaField[];
  supplementaryFields: SupplementaryField[];
};

const initialProductService = (): ProductService => ({
  id: `product_${Date.now()}_${Math.random()}`,
  name: '新产品/服务',
  description: '详细描述您的产品或服务。',
  price: '0.00',
  sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  category: '默认分类',
  link: 'https://example.com',
  media: [
    { id: 'pano', type: 'image', file: null, preview: '', mapping: '' },
    { id: 'top', type: 'image', file: null, preview: '', mapping: '' },
    { id: 'bottom', type: 'image', file: null, preview: '', mapping: '' },
    { id: 'left', type: 'image', file: null, preview: '', mapping: '' },
    { id: 'right', type: 'image', file: null, preview: '', mapping: '' },
    { id: 'front', type: 'image', file: null, preview: '', mapping: '' },
    { id: 'back', type: 'image', file: null, preview: '', mapping: '' },
  ],
  supplementaryFields: [],
});


const productCardMappingOptions = [
    { value: 'defaultImage', label: '默认首图' },
    { value: 'topImage', label: '上视图' },
    { value: 'bottomImage', label: '下视图' },
    { value: 'leftImage', label: '左视图' },
    { value: 'rightImage', label: '右视图' },
    { value: 'frontImage', label: '前视图' },
    { value: 'backImage', label: '后视图' },
    { value: 'description', label: '商品介绍' },
    { value: 'feature_1', label: '特性1' },
    { value: 'feature_2', label: '特性2' },
];

const mediaSlotLabels: {[key: string]: string} = {
    pano: '全景', top: '上', bottom: '下', left: '左', right: '右', front: '前', back: '后'
}

function SupplementaryFieldsManager({ fields, onUpdate, objectType }: { fields: SupplementaryField[], onUpdate: (fields: SupplementaryField[]) => void, objectType: string }) {
    const addField = () => {
        onUpdate([...fields, { id: `${objectType}_sup_${Date.now()}`, key: '', value: '', mapping: '' }]);
    };

    const updateField = (id: string, newKey: string, newValue: any) => {
        onUpdate(fields.map(f => f.id === id ? { ...f, [newKey]: newValue } : f));
    };

    const removeField = (id: string) => {
        onUpdate(fields.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <h4 className="font-semibold">补充内容</h4>
            {fields.map((field) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_auto] gap-2 items-center">
                    <Input placeholder="字段名" value={field.key} onChange={(e) => updateField(field.id, 'key', e.target.value)} />
                    <Input placeholder="字段值" value={field.value} onChange={(e) => updateField(field.id, 'value', e.target.value)} />
                    <Select value={field.mapping} onValueChange={(value) => updateField(field.id, 'mapping', value)}>
                        <SelectTrigger><SelectValue placeholder="商品卡位置" /></SelectTrigger>
                        <SelectContent>
                            {productCardMappingOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={addField}><PlusCircle className="mr-2 h-4 w-4" />增加补充字段</Button>
        </div>
    );
}


function ProductServiceItem({ product, onUpdate, onRemove }: { product: ProductService, onUpdate: (product: ProductService) => void, onRemove: (id: string) => void }) {
    
    const handleFieldChange = (key: keyof ProductService, value: any) => {
        onUpdate({ ...product, [key]: value });
    }
    
    const handleMediaChange = (id: string, file: File | null) => {
        if (file) {
            const newMedia = product.media.map(m => m.id === id ? { ...m, file, preview: URL.createObjectURL(file) } : m);
            onUpdate({ ...product, media: newMedia });
        }
    };
    
    const handleMediaMappingChange = (id: string, mapping: string) => {
        const newMedia = product.media.map(m => m.id === id ? { ...m, mapping } : m);
        onUpdate({ ...product, media: newMedia });
    }

    const setProductSupplementaryFields = (fields: SupplementaryField[]) => {
        onUpdate({ ...product, supplementaryFields: fields });
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                    <ChevronsUpDown className="h-5 w-5" />
                    <Input value={product.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="text-lg font-bold w-auto" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemove(product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>价格</Label>
                        <Input placeholder="价格" value={product.price} onChange={(e) => handleFieldChange('price', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input placeholder="SKU" value={product.sku} onChange={(e) => handleFieldChange('sku', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>类别</Label>
                        <Input placeholder="类别" value={product.category} onChange={(e) => handleFieldChange('category', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>链接</Label>
                        <Input placeholder="产品链接" value={product.link} onChange={(e) => handleFieldChange('link', e.target.value)} />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label>描述</Label>
                        <Textarea placeholder="产品描述" value={product.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
                    </div>
                </div>

                <Accordion type="single" collapsible>
                    <AccordionItem value="media">
                        <AccordionTrigger>媒体文件 (图片/视频)</AccordionTrigger>
                        <AccordionContent className="p-1">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.media.map(media => (
                                    <div key={media.id} className="space-y-2">
                                        <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center relative">
                                            {media.preview ? (
                                                <img src={media.preview} alt="预览" className="object-cover h-full w-full rounded-md" />
                                            ) : (
                                                 <div className="text-center text-muted-foreground p-2">
                                                    <ImageIcon className="mx-auto h-6 w-6"/>
                                                    <p className="text-xs mt-1">{mediaSlotLabels[media.id]}</p>
                                                 </div>
                                            )}
                                            <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleMediaChange(media.id, e.target.files?.[0] || null)} />
                                        </div>
                                        <Select value={media.mapping} onValueChange={(value) => handleMediaMappingChange(media.id, value)}>
                                            <SelectTrigger><SelectValue placeholder="商品卡位置" /></SelectTrigger>
                                            <SelectContent>
                                                {productCardMappingOptions.filter(opt => opt.value.includes('Image')).map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                 <SupplementaryFieldsManager fields={product.supplementaryFields} onUpdate={setProductSupplementaryFields} objectType={`product_${product.id}`} />
            </CardContent>
        </Card>
    );
}


export default function SuppliersPage() {
    const { role } = useAuthStore();
    const [products, setProducts] = useState<ProductService[]>([initialProductService()]);
    const [infoSupplementaryFields, setInfoSupplementaryFields] = useState<SupplementaryField[]>([]);


    const addProduct = () => {
        setProducts(prev => [...prev, initialProductService()]);
    };
    
    const updateProduct = (updatedProduct: ProductService) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }

    const removeProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleInfoSupFieldsUpdate = (fields: SupplementaryField[]) => {
        setInfoSupplementaryFields(fields);
    }

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
                            <CardDescription>保持您的公司档案最新，为AI分析和前端展示提供准确的数据源。</CardDescription>
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
                                    <Textarea id="companyBio" rows={5} defaultValue="一家领先的创新电子元件制造商，拥有超过十年的历史。我们专注于研发和生产高品质的传感器和微控制器，服务于全球的汽车、消费电子和工业自动化行业。"/>
                                </div>
                           </div>
                           <SupplementaryFieldsManager fields={infoSupplementaryFields} onUpdate={handleInfoSupFieldsUpdate} objectType="info" />
                        </CardContent>
                         <CardFooter className="flex justify-end">
                            <Button>保存基本信息</Button>
                         </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="products" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>商品 / 服务管理</CardTitle>
                            <CardDescription>在此添加、编辑或删除您的产品和服务项目。这些信息将用于AI推荐和前端展示。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {products.map(product => (
                                <ProductServiceItem key={product.id} product={product} onUpdate={updateProduct} onRemove={removeProduct} />
                            ))}
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">共 {products.length} 个项目</p>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={addProduct}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> 增加一项
                                </Button>
                                <Button>保存所有变更</Button>
                            </div>
                        </CardFooter>
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
