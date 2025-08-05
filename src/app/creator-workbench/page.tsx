
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelGenerator } from "@/components/features/model-generator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Milestone, Wand2, Briefcase, FileCheck2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockTasks = [
  { id: 'D001', title: '为新的咖啡品牌设计一个定制logo', budget: '¥3,500 - ¥7,000', category: '平面设计' },
  { id: 'D003', title: '为一个新奇小工具寻找3D打印原型', budget: '¥10,000 - ¥17,500', category: '3D建模' },
  { id: 'D005', title: '寻找环保包装的供应商', budget: '可议价', category: '采购' },
];

const mockSubmissions = [
    { name: '科幻士兵角色', category: '3D角色', price: '¥8,400', updated: '2024-07-20' },
    { name: '复古赛车', category: '3D交通工具', price: '¥5,600', updated: '2024-06-15' },
    { name: '奇幻风格的剑', category: '游戏道具', price: '¥1,050', updated: '2024-05-30' },
];

export default function CreatorWorkbenchPage() {
    const { role } = useAuthStore();

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
                  {mockTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.budget}</TableCell>
                      <TableCell>{task.category}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline"><Milestone className="mr-2 h-4 w-4" /> 接受任务</Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>作品名称</TableHead>
                            <TableHead>类别</TableHead>
                            <TableHead>价格</TableHead>
                            <TableHead>最后更新</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockSubmissions.map((submission, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{submission.name}</TableCell>
                                <TableCell>{submission.category}</TableCell>
                                <TableCell>{submission.price}</TableCell>
                                <TableCell>{submission.updated}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
