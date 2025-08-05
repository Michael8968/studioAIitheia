
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Eye, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type KnowledgeEntry = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  content: string;
};

const initialMockEntries: KnowledgeEntry[] = [
  { id: 'K001', name: '3D打印材料指南', category: '制造', tags: ['PLA', 'ABS', '树脂'], content: '详细介绍各种3D打印材料的特性、用途和打印参数。' },
  { id: 'K002', name: '标准供应链术语', category: '物流', tags: ['FOB', 'CIF', 'EXW'], content: '解释国际贸易中常用的供应链术语含义。' },
  { id: 'K003', name: '设计师色彩理论', category: '设计原则', tags: ['类比', '互补'], content: '涵盖色彩搭配的基本原则、心理学和在设计中的应用。' },
  { id: 'K004', name: '软件开发合同模板', category: '法律', tags: ['合同', 'SOW'], content: '一个标准软件外包开发合同的工作说明书（SOW）模板。' },
];

function EntryFormDialog({ open, onOpenChange, onAddEntry }: { open: boolean, onOpenChange: (open: boolean) => void, onAddEntry: (entry: Omit<KnowledgeEntry, 'id'>) => void }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        const newEntry = {
            name,
            category,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            content,
        };
        onAddEntry(newEntry);
        // Reset form and close dialog
        setName('');
        setCategory('');
        setTags('');
        setContent('');
        onOpenChange(false);
    };
    
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>新增知识库条目</DialogTitle>
          <DialogDescription>
            填写新知识的详细信息。这些信息将被AI用于学习和提供更准确的回答。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">条目名称</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="例如：3D打印材料指南" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">类别</Label>
            <Input id="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="例如：制造" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">标签</Label>
            <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="用逗号分隔, 例如: PLA,ABS" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">详细内容</Label>
            <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="详细描述该知识条目..." className="col-span-3" rows={6} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button type="submit" onClick={handleSubmit}>提交条目</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function KnowledgeBasePage() {
    const [entries, setEntries] = useState(initialMockEntries);
    const [isFormOpen, setFormOpen] = useState(false);
    
    const handleAddEntry = (newEntryData: Omit<KnowledgeEntry, 'id'>) => {
        const newEntry = {
            id: `K${String(entries.length + 1).padStart(3, '0')}`,
            ...newEntryData,
        };
        setEntries(prev => [newEntry, ...prev]);
    };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-bold">知识库管理</h1>
          <p className="text-muted-foreground">管理和维护平台AI所依赖的知识。</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索条目..." className="pl-10" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <ListFilter className="mr-2 h-4 w-4" />
                      按类别筛选
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>类别</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem>制造</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>物流</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>设计原则</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>法律</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button onClick={() => setFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                新增条目
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>条目名称</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>标签</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
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
      <EntryFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onAddEntry={handleAddEntry}
      />
    </>
  );
}

