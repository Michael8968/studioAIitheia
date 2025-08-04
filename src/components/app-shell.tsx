'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, ClipboardList, LayoutGrid, UploadCloud, Package, LogIn, UserCircle } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { useAuthStore, type Role } from '@/store/auth';

const allNavItems = {
  user: [
    { href: '/demands', label: '需求池', icon: ClipboardList },
    { href: '/shopping-assistant', label: 'AI 购物助手', icon: Bot },
  ],
  creator: [
     { href: '/creator-workbench', label: '创意者工作台', icon: LayoutGrid },
  ],
  supplier: [
     { href: '/supplier-onboarding', label: '供应商入驻', icon: UploadCloud },
  ],
  admin: [
    { href: '/demands', label: '需求池', icon: ClipboardList },
    { href: '/shopping-assistant', label: 'AI 购物助手', icon: Bot },
    { href: '/creator-workbench', label: '创意者工作台', icon: LayoutGrid },
    { href: '/supplier-onboarding', label: '供应商入驻', icon: UploadCloud },
  ],
};

const getNavItemsForRole = (role: Role | null) => {
  if (!role) return [];
  if (role === 'admin') return allNavItems.admin;
  
  let navItems: typeof allNavItems.admin = [];
  if(allNavItems[role]) {
    navItems = [...navItems, ...allNavItems[role]];
  }
  return navItems;
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, user, logout } = useAuthStore();
  const [navItems, setNavItems] = React.useState(getNavItemsForRole(role));

  React.useEffect(() => {
    setNavItems(getNavItemsForRole(role));
  }, [role]);
  
  const handleLogout = () => {
    logout();
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-center">
              <Package className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 transition-all" />
              <h1 className="text-xl font-bold group-data-[collapsible=icon]:hidden">AI 智能匹配</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
               {navItems.map((item) => (
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
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:hidden">
            <SidebarTrigger variant="outline" size="icon" className="h-8 w-8" />
            <h1 className="text-lg font-semibold">AI 智能匹配</h1>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-6">
            {children}
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
