
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Trash2, Milestone, Phone, Send, UserCheck, Bot, Users, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore, getUsers, type User } from "@/store/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { recommendCreatives, type RecommendCreativesOutput } from '@/ai/flows/recommend-creatives';
import { useToast } from '@/hooks/use-toast';

type Demand = {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  status: '开放中' | '洽谈中' | '已完成' | '已关闭';
  created: string;
};

const initialDemands: Demand[] = [
  { id: 'D001', title: '为新的咖啡品牌设计一个定制logo', description: '我们需要一个现代、简约且令人难忘的logo，要能体现咖啡的温暖和社区感。颜色以棕色和米色为主。', budget: '¥3,500 - ¥7,000', category: '平面设计', status: '开放中', created: '2024-08-01' },
  { id: 'D002', title: '开发一款宠物看护服务的移动应用', description: '一款iOS和Android应用，功能包括用户注册、宠物档案管理、服务预订、在线支付和实时聊天。', budget: '¥56,000 - ¥84,000', category: '软件开发', status: '洽谈中', created: '2024-07-28' },
  { id: 'D003', title: '为一个新奇小工具寻找3D打印原型', description: '一个手持式电子产品的外壳原型，需要高精度打印，材料为ABS或类似强度的塑料。需要提供3D模型文件。', budget: '¥10,000 - ¥17,500', category: '3D建模', status: '开放中', created: '2024-07-25' },
  { id: 'D004', title: '网站专业翻译（中到英）', description: '一个大约5000字的营销网站，内容涉及科技和金融，需要翻译成地道的商务英语。', budget: '¥5,600 - ¥8,400', category: '翻译', status: '已完成', created: '2024-07-15' },
  { id: 'D005', title: '寻找环保包装的供应商', description: '为化妆品系列寻找可持续、可回收的包装解决方案，包括瓶子、罐子和外包装盒。', budget: '可议价', category: '采购', status: '开放中', created: '2024-08-05' },
];

const statusVariantMap: { [key in Demand['status']]: "default" | "secondary" | "destructive" | "outline" } = {
  '开放中': 'default',
  '洽谈中': 'secondary',
  '已完成': 'outline',
  '已关闭': 'destructive',
};

function DemandFormDialog({ onAddDemand }: { onAddDemand: (demand: Omit<Demand, 'id' | 'created' | 'status'>) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onAddDemand({ title, category, budget, description });
    setTitle('');
    setCategory('');
    setBudget('');
    setDescription('');
    setOpen(false);
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

type RecommendationDialogProps = {
  demand: (Demand) | null;
  selectedDemands: (Demand)[];
  creatives: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function RecommendationDialog({ demand, selectedDemands, creatives, open, onOpenChange }: RecommendationDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResults, setAiResults] = useState<RecommendCreativesOutput | null>(null);

  const isBatchMode = selectedDemands.length > 0;
  const currentDemand = isBatchMode ? selectedDemands[0] : demand;
  const title = isBatchMode
    ? `为 ${selectedDemands.length} 个选定的需求推荐执行者`
    : `为需求 “${demand?.title}” 推荐执行者`;
  
  const getAvatar = (user: User): string => {
      if (user.role === 'admin') return 'male administrator';
      if (user.role === 'supplier') return 'technology logo';
      if (user.role === 'creator') return 'female creator';
      return 'user avatar';
  }

  const handleAiRecommend = async () => {
    if (!currentDemand) return;
    setIsLoading(true);
    setAiResults(null);
    try {
      const result = await recommendCreatives({
        demand: {
          title: currentDemand.title,
          description: currentDemand.description,
          category: currentDemand.category,
        },
        creatives: creatives.map(c => ({
            id: c.id,
            name: c.name,
            type: c.role === 'creator' ? 'creator' : 'supplier',
            specialty: c.specialty || '暂无专长'
        })),
      });
      setAiResults(result);
    } catch (error) {
      console.error("AI recommendation failed:", error);
      toast({
        variant: "destructive",
        title: "AI 推荐失败",
        description: "抱歉，在调用AI时发生错误，请稍后再试。",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isBatchMode ? '您选择的创意者或供应商将被推荐给所有选定的需求。' : '推荐最合适的创意者或供应商。'}
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
                    {creatives.map((creative) => (
                      <div key={creative.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint={getAvatar(creative)} />
                                <AvatarFallback>{creative.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-bold flex items-center">{creative.name} <Badge variant="outline" className="ml-2">{creative.role === 'creator' ? '创意者' : '供应商'}</Badge></div>
                                <p className="text-xs text-muted-foreground">{creative.specialty || '暂无专长'}</p>
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
              {!isLoading && !aiResults && (
                <>
                  <Bot className="h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-headline mb-2">AI 智能匹配</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                      AI 将分析需求详情、创意者技能和供应商能力，以找出最佳匹配。
                      {isBatchMode && " (仅分析第一个选定需求作为样本)"}
                  </p>
                  <Button onClick={handleAiRecommend} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    启动 AI 推荐
                  </Button>
                </>
              )}
              {isLoading && (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">AI 正在为您分析最佳人选...</p>
                </div>
              )}
              {aiResults && (
                <div className="w-full text-left space-y-4">
                  <h3 className="text-xl font-headline text-center mb-4">AI 推荐结果</h3>
                  {aiResults.recommendations.map(rec => {
                     const creative = creatives.find(c => c.id === rec.id);
                     if (!creative) return null;
                     return (
                         <Card key={rec.id} className="bg-background">
                           <CardHeader className="flex-row items-center justify-between pb-2">
                              <div className="flex items-center gap-3">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint={getAvatar(creative)} />
                                    <AvatarFallback>{rec.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                 <div>
                                    <p className="font-bold">{rec.name}</p>
                                    <p className="text-xs text-muted-foreground">{creative.specialty}</p>
                                 </div>
                              </div>
                              <Checkbox defaultChecked />
                           </CardHeader>
                           <CardContent>
                              <p className="text-sm text-muted-foreground pl-2 border-l-2 border-primary/50">{rec.reason}</p>
                           </CardContent>
                         </Card>
                     )
                  })}
                   <Button onClick={handleAiRecommend} variant="link" size="sm" className="w-full" disabled={isLoading}>重新生成</Button>
                </div>
              )}
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
  const [creatives, setCreatives] = useState<User[]>([]);
  const [demands, setDemands] = useState<Demand[]>(initialDemands);
  const [isRecDialogOpen, setRecDialogOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchCreatives() {
        try {
            const allUsers = await getUsers();
            const creativeUsers = allUsers.filter(user => user.role === 'creator' || user.role === 'supplier');
            setCreatives(creativeUsers);
        } catch (error) {
            console.error("Failed to fetch creatives:", error);
        }
    }
    fetchCreatives();
  }, []);

  const addDemand = (newDemandData: Omit<Demand, 'id' | 'created' | 'status'>) => {
    const newDemand: Demand = {
        ...newDemandData,
        id: `D${String(demands.length + 1).padStart(3, '0')}`,
        status: '开放中',
        created: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };
    setDemands(prev => [newDemand, ...prev]);
  };


  const handleRecommendClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setSelectedRows([]); // Clear batch selection when opening single
    setRecDialogOpen(true);
  };
  
  const handleBatchRecommendClick = () => {
      setSelectedDemand(null); // Clear single selection
      setRecDialogOpen(true);
  }

  const handleSelectRow = (id: string, checked: CheckedState) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAll = (checked: CheckedState) => {
    if (checked) {
      setSelectedRows(demands.map(d => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const selectedDemandsForDialog = demands.filter(d => selectedRows.includes(d.id));

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">需求池</h1>
            <p className="text-muted-foreground">浏览、承接或在生态系统中发布需求。</p>
          </div>
          {role === 'user' && <DemandFormDialog onAddDemand={addDemand} />}
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
               {role === 'admin' && (
                <Button onClick={handleBatchRecommendClick} disabled={selectedRows.length === 0}>
                  <Users className="mr-2 h-4 w-4" />
                  批量推荐 ({selectedRows.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {role === 'admin' && (
                    <TableHead className="w-[50px]">
                      <Checkbox
                        onCheckedChange={handleSelectAll}
                        checked={selectedRows.length === demands.length && demands.length > 0}
                        aria-label="选择全部"
                      />
                    </TableHead>
                  )}
                  <TableHead>需求标题</TableHead>
                  <TableHead>预算</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布于</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demands.map((demand) => (
                  <TableRow key={demand.id} data-state={selectedRows.includes(demand.id) && "selected"}>
                    {role === 'admin' && (
                      <TableCell>
                        <Checkbox
                          onCheckedChange={(checked) => handleSelectRow(demand.id, checked)}
                          checked={selectedRows.includes(demand.id)}
                          aria-label={`选择需求 ${demand.title}`}
                        />
                      </TableCell>
                    )}
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
      {(isRecDialogOpen) && (
        <RecommendationDialog
          demand={selectedDemand}
          selectedDemands={selectedDemandsForDialog}
          creatives={creatives}
          open={isRecDialogOpen}
          onOpenChange={setRecDialogOpen}
        />
      )}
    </>
  );
}

    