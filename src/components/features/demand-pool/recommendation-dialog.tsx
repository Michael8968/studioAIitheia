
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Bot, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { recommendCreatives, type RecommendCreativesOutput } from '@/ai/flows/recommend-creatives';
import { useToast } from '@/hooks/use-toast';
import type { Demand } from '@/store/demands';
import type { User } from '@/store/auth';

type RecommendationDialogProps = {
  demand: (Demand) | null;
  selectedDemands: (Demand)[];
  creatives: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RecommendationDialog({ demand, selectedDemands, creatives, open, onOpenChange }: RecommendationDialogProps) {
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
