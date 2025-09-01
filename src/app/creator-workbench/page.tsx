
'use client';

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelGenerator } from "@/components/features/model-generator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Milestone, Wand2, Briefcase, FileCheck2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDemands, type Demand } from "@/store/demands";
import { useToast } from "@/hooks/use-toast";

export default function CreatorWorkbenchPage() {
    const { user, role } = useAuthStore();
    const [tasks, setTasks] = useState<Demand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchTasks() {
            setIsLoading(true);
            try {
                const allDemands = await getDemands();
                // In a real app, this filtering would ideally be done on the backend.
                const openTasks = allDemands.filter(d => d.status === '开放中' && (d.category === '平面设计' || d.category === '3D建模'));
                setTasks(openTasks);

            } catch (error) {
                console.error("Failed to fetch tasks:", error);
                 toast({ variant: "destructive", title: "加载失败", description: "无法从服务器获取您的任务列表。" });
            } finally {
                setIsLoading(false);
            }
        }

        if (user) {
            fetchTasks();
        }
    }, [user, toast]);

    if (role !== 'creator' && role !== 'admin') {
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
        <h1 className="text-3xl font-headline font-bold">创意者工作台</h1>
        <p className="text-muted-foreground">管理您的任务，使用 AI 进行创作，并跟踪您的提交。</p>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks"><Briefcase className="mr-2"/> 任务与需求</TabsTrigger>
          <TabsTrigger value="ai-creation"><Wand2 className="mr-2"/> 3D AI 创作</TabsTrigger>
          <TabsTrigger value="submissions"><FileCheck2 className="mr-2"/> 我的提交</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>可接受的任务</CardTitle>
              <CardDescription>这些是与您的技能相匹配的开放需求。接受一个以开始工作。</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>需求标题</TableHead>
                    <TableHead>预算</TableHead>
                    <TableHead>类别</TableHead>
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
                  ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.budget}</TableCell>
                        <TableCell>{task.category}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline"><Milestone className="mr-2 h-4 w-4" /> 接受任务</Button>
                        </TableCell>
                        </TableRow>
                    ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            暂无可接受的任务。
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-creation" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>3D AI 创作</CardTitle>
                    <CardDescription>使用 AI 从文本描述生成 3D 模型预览。</CardDescription>
                </CardHeader>
                <CardContent>
                    <ModelGenerator />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardHeader>
                <CardTitle>我的提交</CardTitle>
                <CardDescription>您已提交和已批准作品的列表。</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>您还没有任何提交。</p>
                    <p className="text-xs mt-1">此功能将在未来的更新中从后端加载您的作品数据。</p>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
