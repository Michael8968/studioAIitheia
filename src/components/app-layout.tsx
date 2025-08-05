
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bot, 
  ClipboardList, 
  Palette, 
  Search, 
  LayoutGrid, 
  UploadCloud, 
  BookCopy, 
  Library, 
  Terminal, 
  KeyRound,
  LogOut,
  Package
} from 'lucide-react';
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
import { Skeleton } from './ui/skeleton';

const navItemsByRole: Record<Role, { href: string; label: string; icon: React.ElementType }[]> = {
  user: [
    { href: '/', label: 'AI 购物助手', icon: Bot },
    { href: '/demand-pool', label: '需求池', icon: ClipboardList },
    { href: '/designers', label: '创意设计师', icon: Palette },
    { href: '/search', label: '智能搜索', icon: Search },
  ],
  creator: [
    { href: '/', label: 'AI 购物助手', icon: Bot },
    { href: '/demand-pool', label: '需求池', icon: ClipboardList },
    { href: '/designers', label: '创意设计师', icon: Palette },
    { href: '/search', label: '智能搜索', icon: Search },
    { href: '/creator-workbench', label: '创意者工作台', icon: LayoutGrid },
  ],
  supplier: [
    { href: '/', label: 'AI 购物助手', icon: Bot },
    { href: '/demand-pool', label: '需求池', icon: ClipboardList },
    { href: '/designers', label: '创意设计师', icon: Palette },
    { href: '/search', label: '智能搜索', icon: Search },
    { href: '/suppliers', label: '供应商中心', icon: UploadCloud },
  ],
  admin: [
    { href: '/', label: 'AI 购物助手', icon: Bot },
    { href: '/demand-pool', label: '需求池', icon: ClipboardList },
    { href: '/designers', label: '创意设计师', icon: Palette },
    { href: '/search', label: '智能搜索', icon: Search },
    { href: '/creator-workbench', label: '创意者工作台', icon: LayoutGrid },
    { href: '/suppliers', label: '供应商中心', icon: UploadCloud },
    { href: '/knowledge-base', label: '知识库管理', icon: BookCopy },
    { href: '/public-resources', label: '公共资源库', icon: Library },
    { href: '/prompts', label: '提示词管理', icon: Terminal },
    { href: '/permissions', label: '权限管理', icon: KeyRound },
  ],
};


export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useAuthStore();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentNavItems = role ? navItemsByRole[role] : [];
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // If not mounted or on login page, don't render the layout
  if (!mounted || pathname === '/login') {
    return <>{children}</>;
  }
  
  // If no role but not on login, redirect to login
  if (!role) {
      router.replace('/login');
      return <div className="flex h-screen w-screen items-center justify-center"><Skeleton className="h-full w-full" /></div>;
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-center">
              <Package className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 transition-all" />
              <h1 className="text-xl font-bold font-headline group-data-[collapsible=icon]:hidden">AI 智能匹配</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
               {currentNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={{children: item.label, side: "right"}}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarContent>
           <SidebarSeparator />
           <SidebarFooter>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="h-auto w-full justify-start p-2">
                    <div className="flex justify-between items-center w-full">
                       <div className="flex items-center gap-2">
                         <Avatar className="w-8 h-8">
                             <AvatarImage src={`https://placehold.co/32x32.png`} data-ai-hint="user avatar" />
                             <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                             <span className="font-semibold text-sm">{user?.name}</span>
                             <span className="text-xs text-muted-foreground">{user?.email}</span>
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
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:hidden">
            <SidebarTrigger variant="outline" size="icon" className="h-8 w-8" />
            <h1 className="text-lg font-semibold font-headline">AI 智能匹配</h1>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-6">
            {children}
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
