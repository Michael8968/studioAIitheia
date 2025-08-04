
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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


const getNavItemsForRole = (role: Role | null) => {
  if (!role) return [];
  if (role === 'admin') {
     return navItems.admin;
  }
  return navItems[role] || [];
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, user, logout } = useAuthStore();
  const currentNavItems = getNavItemsForRole(role);

  const handleLogout = () => {
    logout();
  }

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
                    <SidebarMenuButton asChild isActive={pathname === '/login'} tooltip={{children: '请先登录', side: 'right'}}>
                        <Link href="/login">
                            <LogIn />
                            <span>请先登录</span>
                        </Link>
                    </SidebarMenuButton>
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
                                <AvatarImage src={`https://placehold.co/32x32/orange/white/png?text=${user.name.charAt(0)}`} data-ai-hint="user avatar" />
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
