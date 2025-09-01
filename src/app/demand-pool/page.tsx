
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Trash2, Milestone, Phone, Send, UserCheck, Bot, Users, Loader2, MoreHorizontal } from "lucide-react";
import { useAuthStore, getUsers, type User } from "@/store/auth";
import { Checkbox } from '@/components/ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { useToast } from '@/hooks/use-toast';
import { getDemands, deleteDemand, type Demand } from '@/store/demands';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DemandFormDialog } from '@/components/features/demand-pool/demand-form-dialog';
import { RecommendationDialog } from '@/components/features/demand-pool/recommendation-dialog';

const statusVariantMap: { [key in Demand['status']]: "default" | "secondary" | "destructive" | "outline" } = {
  '开放中': 'default',
  '洽谈中': 'secondary',
  '已完成': 'outline',
  '已关闭': 'destructive',
};

export default function DemandPoolPage() {
  const { role } = useAuthStore();
  const [creatives, setCreatives] = useState<User[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecDialogOpen, setRecDialogOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const [allUsers, allDemands] = await Promise.all([getUsers(), getDemands()]);
            const creativeUsers = allUsers.filter(user => user.role === 'creator' || user.role === 'supplier');
            setCreatives(creativeUsers);
            setDemands(allDemands);
        } catch (error) {
            console.error("Failed to fetch page data:", error);
             toast({ variant: "destructive", title: "加载失败", description: "无法从服务器获取页面数据。" });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const handleAddDemand = (newDemand: Demand) => {
    setDemands(prev => [newDemand, ...prev]);
  };
  
  const handleDeleteDemand = async (demandId: string) => {
    try {
      await deleteDemand(demandId);
      setDemands(prev => prev.filter(d => d.id !== demandId));
      toast({ title: "成功", description: "需求已成功删除。" });
    } catch (error) {
      console.error("Failed to delete demand:", error);
      toast({ variant: "destructive", title: "删除失败", description: "无法删除该需求，请稍后再试。" });
    }
  }


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
          {role === 'user' && <DemandFormDialog onAddDemand={handleAddDemand} />}
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
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={role === 'admin' ? 7 : 6} className="h-24 text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        </TableCell>
                    </TableRow>
                ) : demands.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={role === 'admin' ? 7 : 6} className="h-24 text-center">
                            暂无需求。
                        </TableCell>
                    </TableRow>
                ) : (
                    demands.map((demand) => (
                      <TableRow key={demand.id} data-state={selectedRows.includes(demand.id) ? "selected" : undefined}>
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
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">打开操作菜单</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleRecommendClick(demand)}>
                                            <Send className="mr-2 h-4 w-4" />推荐执行者
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4"/> 删除需求
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>您确定要删除此需求吗？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        此操作无法撤销。这将永久删除需求 “<span className="font-bold">{demand.title}</span>”。
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteDemand(demand.id)} className="bg-destructive hover:bg-destructive/90">确认删除</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {(role === 'supplier' || role === 'creator') && demand.status === '开放中' && (
                            <Button variant="outline" size="sm"><Milestone className="mr-2 h-4 w-4" />抢单</Button>
                          )}
                           {(role === 'supplier' || role === 'creator') && demand.status !== '开放中' && (
                            <Button variant="outline" size="sm" disabled><Phone className="mr-2 h-4 w-4" />沟通</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
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
