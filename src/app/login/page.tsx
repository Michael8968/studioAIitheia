'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAuthStore, type Role } from '@/store/auth';
import { Package } from 'lucide-react';

const roles: {
  id: string,
  name: string;
  role: Role;
  'data-ai-hint': string;
}[] = [
  {
    id: 'admin-1',
    name: '李明 (管理员)',
    role: 'admin',
    'data-ai-hint': 'male administrator',
  },
  {
    id: 'supplier-1',
    name: '创新科技 (供应商)',
    role: 'supplier',
    'data-ai-hint': 'technology logo',
  },
  {
    id: 'creator-1',
    name: '爱丽丝 (创意者)',
    role: 'creator',
    'data-ai-hint': 'female creator',
  },
  {
    id: 'user-1',
    name: '张伟 (普通用户)',
    role: 'user',
    'data-ai-hint': 'male user',
  },
];

const roleRedirectMap: Record<Role, string> = {
    admin: '/',
    user: '/',
    creator: '/creator-workbench',
    supplier: '/suppliers',
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = (userId: string, role: Role) => {
    login(userId, role);
    router.push(roleRedirectMap[role] || '/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
                <Package className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-headline font-bold">AI 智能匹配</h1>
            </div>
            <p className="text-muted-foreground text-lg">选择一个模拟角色登录以体验平台</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl w-full">
            {roles.map((r) => (
            <Card key={r.role} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <CardHeader>
                    <div className="relative mx-auto mb-4 h-24 w-24">
                        <Image src={`https://placehold.co/100x100.png`} alt={`${r.name} avatar`} width={100} height={100} className="rounded-full object-cover" data-ai-hint={r['data-ai-hint']} />
                    </div>
                    <CardTitle className="font-headline">{r.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                </CardContent>
                <CardFooter className="w-full p-4">
                <Button className="w-full" onClick={() => handleLogin(r.id, r.role)} size="lg">
                    登录
                </Button>
                </CardFooter>
            </Card>
            ))}
      </div>
    </div>
  );
}
