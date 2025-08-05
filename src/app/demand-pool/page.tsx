
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Trash2, Milestone, Phone, Send, UserCheck, Bot } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

const mockDemands = [
  { id: 'D001', title: '为新的咖啡品牌设计一个定制logo', budget: '¥3,500 - ¥7,000', category: '平面设计', status: '开放中', created: '2024-08-01' },
  { id: 'D002', title: '开发一款宠物看护服务的移动应用', budget: '¥56,000 - ¥84,000', category: '软件开发', status: '洽谈中', created: '2024-07-28' },
  { id: 'D003', title: '为一个新奇小工具寻找3D打印原型', budget: '¥10,000 - ¥17,500', category: '3D建模', status: '开放中', created: '2024-07-25' },
  { id: 'D004', title: '网站专业翻译（中到英）', budget: '¥5,600 - ¥8,400', category: '翻译', status: '已完成', created: '2024-07-15' },
  { id: 'D005', title: '寻找环保包装的供应商', budget: '可议价', category: '采购', status: '开放中', created: '2024-08-05' },
];

const mockCreatives = [
    { id: 'creator-1', name: '爱丽丝', type: 'creator', avatar: 'female creator', specialty: '奇幻与科幻角色设计' },
    { id: 'creator-2', name: '鲍勃', type: 'creator', avatar: 'male designer', specialty: '建筑可视化' },
    { id: 'creator-3', name: '查理', type: 'creator', avatar: 'male artist', specialty: '游戏资产' },
    { id: 'supplier-1', name: '创新科技', type: 'supplier', avatar: 'technology logo', specialty: '高精度3D打印' },
    { id: 'supplier-2', name: '快速原型公司', type: 'supplier', avatar: 'industrial logo', specialty: 'SLA & FDM 打印' },
];

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  '开放中': 'default',
  '洽谈中': 'secondary',
  '已完成': 'outline',
};

function DemandFormDialog() {
  return (
    <Dialog>
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
            <Input id="title" placeholder="例如：定制logo设计" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">类别</Label>
            <Input id="category" placeholder="例如：平面设计" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">预算</Label>
            <Input id="budget" placeholder="例如：¥3,500 - ¥7,000" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">描述</Label>
            <Textarea id="description" placeholder="详细描述您的需求..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">提交需求</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type RecommendationDialogProps = {
  demand: typeof mockDemands[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function RecommendationDialog({ demand, open, onOpenChange }: RecommendationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>推荐执行者</DialogTitle>
          <DialogDescription>
            为需求 <span className="font-semibold text-primary">“{demand.title}”</span> 推荐最合适的创意者或供应商。
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual"><UserCheck className="mr-2 h-4 w-4" />手动推荐</TabsTrigger>
            <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4" />AI 智能推荐</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">选择创意者或供应商</CardTitle>
                <CardDescription>勾选您想要推荐的候选人。</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  <div className="space-y-4 pr-4">
                    {mockCreatives.map((creative) => (
                      <div key={creative.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint={creative.avatar} />
                                <AvatarFallback>{creative.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">{creative.name} <Badge variant="outline" className="ml-2">{creative.type === 'creator' ? '创意者' : '供应商'}</Badge></p>
                                <p className="text-xs text-muted-foreground">{creative.specialty}</p>
                            </div>
                        </div>
                        <Checkbox id={`creative-${creative.id}`} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ai" className="mt-4">
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full min-h-[300px]">
                <Bot className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-xl font-headline mb-2">AI 智能匹配</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    AI 将分析需求详情、创意者技能和供应商能力，以找出最佳匹配。
                </p>
                <Button>启动 AI 推荐</Button>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button>发送推荐</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function DemandPoolPage() {
  const { role } = useAuthStore();
  const [isRecDialogOpen, setRecDialogOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<typeof mockDemands[0] | null>(null);

  const handleRecommendClick = (demand: typeof mockDemands[0]) => {
    setSelectedDemand(demand);
    setRecDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">需求池</h1>
            <p className="text-muted-foreground">浏览、承接或在生态系统中发布需求。</p>
          </div>
          {role === 'user' && <DemandFormDialog />}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="按标题或标签搜索..." className="pl-10" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    筛选
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>筛选条件</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>类别</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>状态</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>需求标题</TableHead>
                  <TableHead>预算</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布于</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDemands.map((demand) => (
                  <TableRow key={demand.id}>
                    <TableCell className="font-medium">{demand.title}</TableCell>
                    <TableCell>{demand.budget}</TableCell>
                    <TableCell>{demand.category}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[demand.status] || 'default'}>{demand.status}</Badge>
                    </TableCell>
                    <TableCell>{demand.created}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {role === 'admin' && (
                        <>
                            <Button variant="outline" size="sm" onClick={() => handleRecommendClick(demand)}>
                                <Send className="mr-2 h-4 w-4" />推荐
                            </Button>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </>
                      )}
                      {(role === 'supplier' || role === 'creator') && demand.status === '开放中' && (
                        <Button variant="outline" size="sm"><Milestone className="mr-2 h-4 w-4" />抢单</Button>
                      )}
                       {(role === 'supplier' || role === 'creator') && demand.status !== '开放中' && (
                        <Button variant="outline" size="sm" disabled><Phone className="mr-2 h-4 w-4" />沟通</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {selectedDemand && (
        <RecommendationDialog
          demand={selectedDemand}
          open={isRecDialogOpen}
          onOpenChange={setRecDialogOpen}
        />
      )}
    </>
  );
}
