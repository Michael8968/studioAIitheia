
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAuthStore, type Role } from '@/store/auth';

const roles: {
  name: string;
  title: string;
  description: string;
  badgeText: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  role: Role;
  loginText: string;
  'data-ai-hint': string;
}[] = [
  {
    name: '李明',
    title: '李明 (管理员)',
    description: '拥有所有权限,可以访问所有页面,包括用户管理和供应商数据整合。',
    badgeText: '管理员',
    badgeVariant: 'destructive',
    role: 'admin',
    loginText: '以李明身份登录',
    'data-ai-hint': 'male administrator',
  },
  {
    name: '创新科技',
    title: '创新科技 (供应商)',
    description: '可以访问供应商整合页面以上传和管理自己的产品数据,并能使用智能搜索。',
    badgeText: '供应商',
    badgeVariant: 'secondary',
    role: 'supplier',
    loginText: '以创新科技身份登录',
    'data-ai-hint': 'technology logo',
  },
  {
    name: '张伟',
    title: '张伟 (普通用户)',
    description: '可以使用智能匹配和智能搜索功能来发现最适合自己的产品和服务。',
    badgeText: '普通用户',
    badgeVariant: 'outline',
    role: 'user',
    loginText: '以张伟身份登录',
    'data-ai-hint': 'male user',
  },
  {
    name: '王芳',
    title: '王芳 (创意者)',
    description: '可以访问创意工坊,利用AI工具进行内容创作和设计。',
    badgeText: '创意者',
    badgeVariant: 'default',
    role: 'creator',
    loginText: '以王芳身份登录',
    'data-ai-hint': 'female creator',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = (role: Role) => {
    login(role);
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">选择一个角色登录</h1>
        <p className="text-muted-foreground mt-2">体验不同用户角色的功能。这是一个模拟登录,无需密码。</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((r) => (
          <Card key={r.role} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-4">
                <Image src="https://placehold.co/100x100.png" alt={`${r.name} avatar`} width={100} height={100} className="rounded-full" data-ai-hint={r['data-ai-hint']} />
              </div>
              <CardTitle>{r.title}</CardTitle>
              <div className="flex justify-center pt-2">
                <Badge variant={r.badgeVariant}>{r.badgeText}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{r.description}</CardDescription>
            </CardContent>
            <CardFooter className="w-full">
              <Button className="w-full" onClick={() => handleLogin(r.role)}>
                {r.loginText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
