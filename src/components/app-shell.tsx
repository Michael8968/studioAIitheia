
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bot, ClipboardList, LayoutGrid, UploadCloud, Package, LogIn, UserCircle, LogOut } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuthStore, type Role } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

const navItems = {
  user: [
    { href: '/shopping-assistant', label: 'AI 购物助手', icon: Bot },
    { href: '/demands', label: '需求池', icon: ClipboardList },
  ],
  creator: [
     { href: '/creator-workbench', label: '创意者工作台', icon: LayoutGrid },
  ],
  supplier: [
     { href: '/supplier-onboarding', label: '供应商入驻', icon: UploadCloud },
  ],
  admin: [
    { href: '/shopping-assistant', label: 'AI 购物助手', icon: Bot },
    { href: '/demands', label: '需求池', icon: ClipboardList },
    { href: '/creator-workbench', label: '创意者工作台', icon: LayoutGrid },
    { href: '/supplier-onboarding', label: '供应商入驻', icon: UploadCloud },
  ],
};

const loginRoles: { name: string; role: Role }[] = [
    { name: '以李明身份登录 (管理员)', role: 'admin' },
    { name: '以创新科技身份登录 (供应商)', role: 'supplier' },
    { name: '以王芳身份登录 (创意者)', role: 'creator' },
    { name: '以张伟身份登录 (普通用户)', role: 'user' },
];

const roleRedirectMap: Record<Role, string> = {
    admin: '/shopping-assistant',
    user: '/shopping-assistant',
    creator: '/creator-workbench',
    supplier: '/supplier-onboarding',
};

const getNavItemsForRole = (role: Role | null) => {
  if (!role) return [];
  // Admin sees all items from other roles combined
  if (role === 'admin') {
    const allItems = [
      ...navItems.user,
      ...navItems.creator,
      ...navItems.supplier,
    ];
    // Remove duplicates
    return allItems.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.href === item.href && t.label === item.label
        ))
    );
  }
  return navItems[role] || [];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, login, logout } = useAuthStore();
  const currentNavItems = getNavItemsForRole(role);

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  const handleLogin = (role: Role) => {
    login(role);
    router.push(roleRedirectMap[role] || '/shopping-assistant');
  };

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-center">
              <Package className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 transition-all" />
              <h1 className="text-xl font-bold group-data-[collapsible=icon]:hidden">Alitheia</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
               {currentNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={{children: item.label, side: "right"}}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
               {!role && (
                 <SidebarMenuItem>
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <SidebarMenuButton isActive={pathname === '/login'} tooltip={{children: '请登录', side: 'right'}}>
                            <LogIn />
                            <span>请登录</span>
                        </SidebarMenuButton>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent side="right" align="start" className="w-64">
                       <DropdownMenuLabel>选择一个角色登录</DropdownMenuLabel>
                       <DropdownMenuSeparator/>
                       {loginRoles.map((r) => (
                         <DropdownMenuItem key={r.role} onClick={() => handleLogin(r.role)}>
                           {r.name}
                         </DropdownMenuItem>
                       ))}
                     </DropdownMenuContent>
                   </DropdownMenu>
                </SidebarMenuItem>
               )}
            </SidebarMenu>
          </SidebarContent>
           {role && user && (
            <>
              <SidebarSeparator />
              <SidebarFooter>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto w-full justify-start p-2">
                       <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={`https://placehold.co/32x32.png`} data-ai-hint="user avatar" />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                                <span className="font-semibold text-sm">{user.name}</span>
                                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                            </div>
                        </div>
                       </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="end" className="w-56">
                    <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>退出登录</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarFooter>
            </>
          )}
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:hidden">
            <SidebarTrigger variant="outline" size="icon" className="h-8 w-8" />
            <h1 className="text-lg font-semibold">Alitheia</h1>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-6">
            {children}
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
