
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Role } from '@/store/auth';

const mockUsers = [
  { id: 'user-1', name: '李明', role: 'admin', avatar: 'https://placehold.co/40x40.png', initials: 'LM' },
  { id: 'user-2', name: '创新科技', role: 'supplier', avatar: 'https://placehold.co/40x40.png', initials: '创' },
  { id: 'user-3', name: '王芳', role: 'creator', avatar: 'https://placehold.co/40x40.png', initials: 'WF' },
  { id: 'user-4', name: '张伟', role: 'user', avatar: 'https://placehold.co/40x40.png', initials: 'ZW' },
  { id: 'user-5', name: '刘丽', role: 'creator', avatar: 'https://placehold.co/40x40.png', initials: 'LL' },
];

const roleMap: Record<Role, string> = {
  admin: '管理员',
  supplier: '供应商',
  creator: '创意者',
  user: '普通用户',
};

const roleVariantMap: Record<Role, 'destructive' | 'secondary' | 'default' | 'outline'> = {
    admin: 'destructive',
    supplier: 'secondary',
    creator: 'default',
    user: 'outline',
};

export default function PermissionManagementPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">权限管理</h1>
          <p className="text-muted-foreground">管理平台所有用户的角色和权限。</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>查看和编辑用户的角色。</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>当前角色</TableHead>
                <TableHead className="w-[180px]">更改角色为</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleVariantMap[user.role as Role]}>{roleMap[user.role as Role]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole as Role)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择一个角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">管理员</SelectItem>
                        <SelectItem value="supplier">供应商</SelectItem>
                        <SelectItem value="creator">创意者</SelectItem>
                        <SelectItem value="user">普通用户</SelectItem>
                      </SelectContent>
                    </Select>
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
