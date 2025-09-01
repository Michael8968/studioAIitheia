
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Save, ShieldBan, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { type Role, type User, getUsers, type UserStatus, updateUser, deleteUser } from "@/store/auth";
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const statusVariantMap: { [key in UserStatus]: "default" | "secondary" | "destructive" } = {
  '正常': 'default',
  '已暂停': 'secondary',
  '黑名单': 'destructive',
};

export default function PermissionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingChanges, setPendingChanges] = useState<{ [userId: string]: Partial<User> }>({});
  const { toast } = useToast();

  const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({ variant: "destructive", title: "加载失败", description: "无法从服务器获取用户列表。" });
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, [toast]);


  const handleFieldChange = (userId: string, field: keyof User, value: any) => {
    // Update local state for immediate UI feedback
    setUsers(users.map(u => u.id === userId ? { ...u, [field]: value } : u));
    // Stage the change for saving
    setPendingChanges(prev => ({
        ...prev,
        [userId]: { ...prev[userId], [field]: value }
    }));
  };

  const handleSaveChanges = async (userId: string) => {
    const changes = pendingChanges[userId];
    if (!changes) return;

    try {
        await updateUser(userId, changes);
        toast({ title: "成功", description: "用户数据已更新。" });
        // Clear pending changes for this user
        setPendingChanges(prev => {
            const newChanges = { ...prev };
            delete newChanges[userId];
            return newChanges;
        });
    } catch (error) {
        toast({ variant: "destructive", title: "更新失败", description: "无法保存更改，请重试。" });
        // Optionally, revert local state changes here by refetching
        fetchUsers();
    }
  };

  const handleUpdateStatus = async (userId: string, status: UserStatus) => {
    try {
        await updateUser(userId, { status });
        setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
        toast({ title: "成功", description: `用户状态已更新为“${status}”。`});
    } catch(error) {
        toast({ variant: "destructive", title: "操作失败", description: "无法更新用户状态。" });
    }
  }

  const handleDeleteUser = async (userId: string) => {
      try {
          await deleteUser(userId);
          setUsers(users.filter(u => u.id !== userId));
          toast({ title: "成功", description: "用户已被删除。" });
      } catch (error) {
          toast({ variant: "destructive", title: "删除失败", description: "无法删除用户。" });
      }
  }

  const getAvatar = (role: Role, name: string): string => {
      if (role === 'admin') return 'male administrator';
      if (role === 'supplier') return 'technology logo';
      if (role === 'creator') {
          const creatorMap: {[key: string]: string} = {
              '爱丽丝': 'female creator',
              '鲍勃': 'male designer',
              '查理': 'male artist',
              '戴安娜': 'female artist',
          }
          return creatorMap[name] || 'female creator';
      };
      if (role === 'user') {
          const userMap: {[key: string]: string} = {
              '张伟': 'male user',
              '陈洁': 'female user',
          }
          return userMap[name] || 'user avatar';
      };
      return 'user avatar';
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">权限管理</h1>
        <p className="text-muted-foreground">管理平台用户的角色、状态和权限。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>所有用户</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>评级</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} data-state={pendingChanges[user.id] ? "selected" : undefined}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={`https://placehold.co/40x40.png`} alt={user.name} width={40} height={40} className="rounded-full" data-ai-hint={getAvatar(user.role, user.name)} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[user.status || '正常']} className={(user.status || '正常') === '正常' ? 'bg-green-500' : ''}>{user.status || '正常'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={user.role} onValueChange={(newRole) => handleFieldChange(user.id, 'role', newRole as Role)} disabled={user.role === 'admin'}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="选择角色" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">管理员</SelectItem>
                          <SelectItem value="supplier">供应商</SelectItem>
                          <SelectItem value="creator">创意者</SelectItem>
                          <SelectItem value="user">用户</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < (user.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                          ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={user.role === 'admin'}>
                                <MoreHorizontal className="h-4 w-4" />
                                 <span className="sr-only">打开操作菜单</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>管理操作</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSaveChanges(user.id)} disabled={!pendingChanges[user.id]}>
                                  <Save className="mr-2 h-4 w-4"/> 保存角色
                              </DropdownMenuItem>
                               {(user.status || '正常') !== '已暂停' ? 
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, '已暂停')}><ShieldBan className="mr-2 h-4 w-4"/> 暂停用户</DropdownMenuItem>
                                  : <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, '正常')}><ShieldCheck className="mr-2 h-4 w-4"/> 重新激活</DropdownMenuItem>
                              }
                               <DropdownMenuSeparator />
                               <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4"/> 删除用户
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                           <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>您确定要删除此用户吗？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    此操作无法撤销。这将永久删除用户 <span className="font-bold">{user.name}</span> 的账户并从我们的服务器中删除其数据。
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">确认删除</AlertDialogAction>
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

    