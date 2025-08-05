
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, ListFilter, Eye, Edit, Trash2 } from "lucide-react";

const mockEntries = [
  { id: 'K001', name: '3D打印材料指南', category: '制造', tags: ['PLA', 'ABS', '树脂'] },
  { id: 'K002', name: '标准供应链术语', category: '物流', tags: ['FOB', 'CIF', 'EXW'] },
  { id: 'K003', name: '设计师色彩理论', category: '设计原则', tags: ['类比', '互补'] },
  { id: 'K004', name: '软件开发合同模板', category: '法律', tags: ['合同', 'SOW'] },
];

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">知识库管理</h1>
        <p className="text-muted-foreground">管理和维护平台AI所依赖的知识。</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索条目..." className="pl-10" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    按类别筛选
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>类别</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>制造</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>物流</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>设计</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>法律</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              新增条目
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>条目名称</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>标签</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {entry.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
