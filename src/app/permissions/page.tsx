
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

type UserStatus = "Active" | "Suspended" | "Banned";

const mockUsers: { id: string; name: string; email: string; role: Role; status: UserStatus; rating: number; avatar: string; }[] = [
  { id: 'admin-1', name: 'Li Ming', email: 'li.ming@example.com', role: 'admin', status: 'Active', rating: 5, avatar: 'male administrator' },
  { id: 'supplier-1', name: 'Innovative Tech', email: 'contact@chuangxin.tech', role: 'supplier', status: 'Active', rating: 4, avatar: 'technology logo' },
  { id: 'creator-1', name: 'Wang Fang', email: 'wang.fang@example.com', role: 'creator', status: 'Active', rating: 5, avatar: 'female creator' },
  { id: 'user-1', name: 'Zhang Wei', email: 'zhang.wei@example.com', role: 'user', status: 'Suspended', rating: 3, avatar: 'male user' },
  { id: 'user-2', name: 'Chen Jie', email: 'chen.jie@example.com', role: 'user', status: 'Banned', rating: 1, avatar: 'female user' },
];

const statusVariantMap: { [key in UserStatus]: "default" | "secondary" | "destructive" } = {
  'Active': 'default',
  'Suspended': 'secondary',
  'Banned': 'destructive',
};


export default function PermissionsPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Permission Management</h1>
        <p className="text-muted-foreground">Manage user roles, statuses, and permissions across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    <Badge variant={statusVariantMap[user.status]} className={user.status === 'Active' ? 'bg-green-500' : ''}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole as Role)} disabled={user.role === 'admin'}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="creator">Creator</SelectItem>
                        <SelectItem value="user">User</SelectItem>
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
                        <DropdownMenuItem><Save className="mr-2 h-4 w-4"/> Save Role</DropdownMenuItem>
                        {user.status !== 'Suspended' ? 
                            <DropdownMenuItem><ShieldBan className="mr-2 h-4 w-4"/> Suspend User</DropdownMenuItem>
                            : <DropdownMenuItem><ShieldCheck className="mr-2 h-4 w-4"/> Reactivate User</DropdownMenuItem>
                        }
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/> Delete User
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
