'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { type KnowledgeEntry, type KnowledgeEntryData, getKnowledgeEntries, addKnowledgeEntry, deleteKnowledgeEntry } from "@/store/knowledge";

function EntryFormDialog({ open, onOpenChange, onAddEntry, isLoading }: { open: boolean, onOpenChange: (open: boolean) => void, onAddEntry: (entry: KnowledgeEntryData) => Promise<void>, isLoading: boolean }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        const newEntry = {
            name,
            category,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            content,
        };
        await onAddEntry(newEntry);
        // Reset form and close dialog
        setName('');
        setCategory('');
        setTags('');
        setContent('');
        onOpenChange(false);
    };
    
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                新增条目
              </Button>
        </DialogTrigger>
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>取消</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            提交条目
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function KnowledgeBasePage() {
    const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchEntries = async () => {
            setIsLoading(true);
            try {
                const fetchedEntries = await getKnowledgeEntries();
                setEntries(fetchedEntries);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: '加载失败',
                    description: '无法从服务器获取知识库条目。',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchEntries();
    }, [toast]);
    
    const handleAddEntry = async (newEntryData: KnowledgeEntryData) => {
        setIsSubmitting(true);
        try {
            const newEntry = await addKnowledgeEntry(newEntryData);
            setEntries(prev => [newEntry, ...prev]);
             toast({ title: '成功', description: '知识库条目已成功添加。' });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '添加失败',
                description: '无法添加新的知识库条目，请稍后再试。',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEntry = async (entryId: string) => {
        try {
            await deleteKnowledgeEntry(entryId);
            setEntries(prev => prev.filter(e => e.id !== entryId));
            toast({ title: '成功', description: '条目已成功删除。' });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: '删除失败',
                description: '无法删除该条目，请稍后再试。',
            });
        }
    };

  return (
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
            <EntryFormDialog
              open={isFormOpen}
              onOpenChange={setFormOpen}
              onAddEntry={handleAddEntry}
              isLoading={isSubmitting}
            />
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
              {isLoading ? (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                </TableRow>
              ) : entries.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        知识库中暂无条目。
                    </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {entry.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" disabled><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>您确定要删除此条目吗？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    此操作无法撤销。这将永久删除 “<span className="font-bold">{entry.name}</span>” 条目。
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)} className="bg-destructive hover:bg-destructive/90">确认删除</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
