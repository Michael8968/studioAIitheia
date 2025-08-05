
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Ban } from "lucide-react";

const mockPrompts = [
  { id: 'userProfilePrompt', name: '用户画像生成器', scope: 'AI购物助手', status: '生效中' },
  { id: 'productRecommendationsPrompt', name: '商品推荐器', scope: 'AI购物助手', status: '生效中' },
  { id: 'evaluateSellerDataPrompt', name: '供应商数据评估器', scope: '供应商中心', status: '生效中' },
  { id: 'generate3DModelPrompt', name: '3D模型生成器', scope: '创意者工作台', status: '生效中' },
];

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">提示词管理</h1>
        <p className="text-muted-foreground">查看并管理应用中使用的AI提示词。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>系统提示词</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>提示词名称</TableHead>
                <TableHead>提示词ID</TableHead>
                <TableHead>范围</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.name}</TableCell>
                  <TableCell className="font-mono text-xs">{prompt.id}</TableCell>
                  <TableCell>{prompt.scope}</TableCell>
                  <TableCell>
                    <Badge variant={prompt.status === '生效中' ? 'default' : 'destructive'} className={prompt.status === '生效中' ? 'bg-green-500' : ''}>{prompt.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled><Ban className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
