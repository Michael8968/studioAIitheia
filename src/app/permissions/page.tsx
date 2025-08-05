
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Save, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import type { Role } from "@/store/auth";

type UserStatus = "正常" | "已暂停" | "黑名单";

const mockUsers: { id: string; name: string; email: string; role: Role; status: UserStatus; rating: number; avatar: string; }[] = [
  { id: 'admin-1', name: '李明', email: 'li.ming@example.com', role: 'admin', status: '正常', rating: 5, avatar: 'male administrator' },
  { id: 'supplier-1', name: '创新科技', email: 'contact@chuangxin.tech', role: 'supplier', status: '正常', rating: 4, avatar: 'technology logo' },
  { id: 'creator-1', name: '王芳', email: 'wang.fang@example.com', role: 'creator', status: '正常', rating: 5, avatar: 'female creator' },
  { id: 'user-1', name: '张伟', email: 'zhang.wei@example.com', role: 'user', status: '已暂停', rating: 3, avatar: 'male user' },
  { id: 'user-2', name: '陈洁', email: 'chen.jie@example.com', role: 'user', status: '黑名单', rating: 1, avatar: 'female user' },
];

const statusVariantMap: { [key in UserStatus]: "default" | "secondary" | "destructive" } = {
  '正常': 'default',
  '已暂停': 'secondary',
  '黑名单': 'destructive',
};


export default function PermissionsPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image src={`https://placehold.co/40x40.png`} alt={user.name} width={40} height={40} className="rounded-full" data-ai-hint={user.avatar} />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[user.status]} className={user.status === '正常' ? 'bg-green-500' : ''}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole as Role)} disabled={user.role === 'admin'}>
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
                            <Star key={i} className={`h-4 w-4 ${i < user.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={user.role === 'admin'}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Save className="mr-2 h-4 w-4"/> 保存角色</DropdownMenuItem>
                        {user.status !== '已暂停' ? 
                            <DropdownMenuItem><ShieldBan className="mr-2 h-4 w-4"/> 暂停用户</DropdownMenuItem>
                            : <DropdownMenuItem><ShieldCheck className="mr-2 h-4 w-4"/> 重新激活</DropdownMenuItem>
                        }
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/> 删除用户
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
