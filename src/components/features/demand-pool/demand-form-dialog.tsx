
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { addDemand, type Demand } from '@/store/demands';

export function DemandFormDialog({ onAddDemand }: { onAddDemand: (demand: Demand) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: '错误', description: '您必须登录才能发布需求。' });
        return;
    }
    const newDemandData = { title, category, budget, description, authorId: user.id };
    try {
        const newDemand = await addDemand(newDemandData);
        onAddDemand(newDemand);
        toast({ title: '成功', description: '您的需求已成功发布！' });
        setTitle('');
        setCategory('');
        setBudget('');
        setDescription('');
        setOpen(false);
    } catch(error) {
        console.error("Failed to add demand:", error);
        toast({ variant: 'destructive', title: '发布失败', description: '创建需求时出错，请稍后再试。' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          发布新需求
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>发布新需求</DialogTitle>
          <DialogDescription>
            填写您的需求详情。它将对相关的创意者和供应商可见。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">标题</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：定制logo设计" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">类别</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="例如：平面设计" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">预算</Label>
            <Input id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="例如：¥3,500 - ¥7,000" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">描述</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="详细描述您的需求..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button type="submit" onClick={handleSubmit}>提交需求</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
