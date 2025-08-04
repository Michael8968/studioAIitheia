
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ModelGenerator } from '@/components/features/model-generator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { CheckCircle, Clock, FileText, Gift, Lightbulb, Palette } from 'lucide-react';


const mockCreators = [
  {
    id: 'creator-1',
    name: '李明',
    avatar: '/avatars/01.png',
    initials: 'LM',
    bio: '专注于未来派3D模型的设计师。',
    tasks: [
      { id: 'task-1', title: '设计一款赛博朋克风格的飞行汽车', status: '进行中' },
      { id: 'task-2', title: '为游戏场景创建低多边形城市景观', status: '待开始' },
    ],
    demands: [
        { id: 'demand-1', title: '需要科幻主题的无人机模型', category: '电子产品', budget: 500 },
        { id: 'demand-2', title: '寻找未来主义风格的建筑概念艺术', category: '其他', budget: 800 },
    ],
    submissions: [
      { id: 'sub-1', title: '复古未来主义机器人', imageUrl: 'https://placehold.co/600x400.png', status: '已批准', 'data-ai-hint':'futuristic robot' },
      { id: 'sub-2', title: '太空殖民地概念图', imageUrl: 'https://placehold.co/600x400.png', status: '审核中', 'data-ai-hint':'space colony' },
    ],
  },
  {
    id: 'creator-2',
    name: '王芳',
    avatar: '/avatars/02.png',
    initials: 'WF',
    bio: '热爱有机形态和自然纹理的艺术家。',
    tasks: [
       { id: 'task-3', title: '制作一系列奇幻风格的植物模型', status: '进行中' },
    ],
    demands: [
        { id: 'demand-3', title: '有机棉T恤的图案设计', category: '服装', budget: 300 },
    ],
    submissions: [
      { id: 'sub-3', title: '发光的蘑菇森林', imageUrl: 'https://placehold.co/600x400.png', status: '已批准', 'data-ai-hint':'glowing mushrooms' },
    ],
  },
  {
    id: 'creator-3',
    name: '张伟',
    avatar: '/avatars/03.png',
    initials: 'ZW',
    bio: '擅长制作写实风格的家居用品模型。',
     tasks: [
      { id: 'task-4', title: '创建一套现代简约风格的家具模型', status: '已完成' },
      { id: 'task-5', title: '为产品目录渲染一系列厨房用具', status: '进行中' },
    ],
    demands: [
        { id: 'demand-4', title: '寻找现代风格的沙发3D模型', category: '家居用品', budget: 1200 },
        { id: 'demand-5', title: '需要一款北欧风格吊灯的模型', category: '家居用品', budget: 450 },
    ],
    submissions: [
      { id: 'sub-4', title: '组合式沙发', imageUrl: 'https://placehold.co/600x400.png', status: '审核中', 'data-ai-hint':'sectional sofa' },
      { id: 'sub-5', title: '大理石餐桌', imageUrl: 'https://placehold.co/600x400.png', status: '已批准', 'data-ai-hint':'marble table' },
    ],
  },
  {
    id: 'creator-4',
    name: '刘丽',
    avatar: '/avatars/04.png',
    initials: 'LL',
    bio: '对角色设计和动漫美学充满热情。',
     tasks: [
      { id: 'task-6', title: '设计一个可爱的吉祥物角色', status: '待开始' },
    ],
    demands: [
        { id: 'demand-6', title: '为独立游戏设计像素艺术角色', category: '其他', budget: 600 },
    ],
    submissions: [
       { id: 'sub-6', title: '魔法少女', imageUrl: 'https://placehold.co/600x400.png', status: '已批准', 'data-ai-hint':'magical girl' },
    ],
  },
];

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' } = {
  '进行中': 'default',
  '待开始': 'secondary',
  '已完成': 'outline',
};

const submissionStatusVariantMap: { [key: string]: 'secondary' | 'default' | 'outline' } = {
    '已批准': 'secondary',
    '审核中': 'default',
    '已拒绝': 'destructive',
};

const categoryIconMap: { [key: string]: React.ElementType } = {
    '电子产品': Gift,
    '家居用品': Lightbulb,
    '服装': Palette,
    '其他': FileText
}


export default function CreatorWorkbenchPage() {
  const [selectedCreatorId, setSelectedCreatorId] = useState(mockCreators[0].id);
  const creator = mockCreators.find(c => c.id === selectedCreatorId)!;

  const handleCreatorChange = (id: string) => {
    setSelectedCreatorId(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">创意者工作台</h1>
          <p className="text-muted-foreground">管理您的任务、需求和创作。</p>
        </div>
         <div className="flex items-center gap-4">
          <Select value={selectedCreatorId} onValueChange={handleCreatorChange}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="选择一个创作者...">
                 <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{creator.name}</p>
                        <p className="text-xs text-muted-foreground">{creator.bio}</p>
                    </div>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {mockCreators.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={c.avatar} alt={c.name} />
                        <AvatarFallback>{c.initials}</AvatarFallback>
                    </Avatar>
                     <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.bio}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="tasks">当前任务</TabsTrigger>
          <TabsTrigger value="demands">相关需求</TabsTrigger>
          <TabsTrigger value="submissions">我的提交</TabsTrigger>
          <TabsTrigger value="generator">AI 3D 生成</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>当前任务</CardTitle>
              <CardDescription>您正在进行或计划中的任务。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
             {creator.tasks.length > 0 ? (
                creator.tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <p className="font-medium">{task.title}</p>
                        <Badge variant={statusVariantMap[task.status]}>{task.status}</Badge>
                    </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">没有当前任务。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="demands" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>相关需求</CardTitle>
              <CardDescription>与您的技能匹配的可用需求。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {creator.demands.length > 0 ? (
                creator.demands.map(demand => {
                    const Icon = categoryIconMap[demand.category] || FileText;
                    return (
                        <Card key={demand.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{demand.title}</CardTitle>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm pt-1">
                                    <Icon className="h-4 w-4" />
                                    <span>{demand.category}</span>
                                </div>
                            </CardHeader>
                            <CardFooter>
                                <p className="text-primary font-bold text-lg">${demand.budget}</p>
                            </CardFooter>
                        </Card>
                    )
                })
              ) : (
                 <div className="md:col-span-2 text-muted-foreground text-center py-8">
                  <p>没有找到相关需求。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>我的提交</CardTitle>
               <CardDescription>您过去提交的作品以及它们的状态。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {creator.submissions.length > 0 ? (
                creator.submissions.map(sub => {
                  const StatusIcon = sub.status === '已批准' ? CheckCircle : Clock;
                  return (
                    <Card key={sub.id} className="overflow-hidden">
                       <div className="aspect-video bg-muted relative">
                        <Image src={sub.imageUrl} alt={sub.title} layout="fill" objectFit="cover" data-ai-hint={sub['data-ai-hint']} />
                       </div>
                       <div className="p-4">
                        <p className="font-semibold">{sub.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <StatusIcon className={`h-4 w-4 ${sub.status === '已批准' ? 'text-green-500' : ''}`} />
                            <Badge variant={submissionStatusVariantMap[sub.status] || 'default'}>{sub.status}</Badge>
                        </div>
                       </div>
                    </Card>
                  )
                })
             ) : (
                <div className="lg:col-span-3 text-muted-foreground text-center py-8">
                    <p>没有历史提交记录。</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="generator" className="mt-4">
          <ModelGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
