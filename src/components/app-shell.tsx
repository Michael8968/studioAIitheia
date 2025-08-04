'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, ClipboardList, LayoutGrid, UploadCloud, Package } from 'lucide-react';
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
import { Button } from './ui/button';

const navItems = [
  { href: '/', label: 'AI 购物助手', icon: Bot },
  { href: '/demands', label: '需求池', icon: ClipboardList },
  { href: '/creator-workbench', label: '创意者工作台', icon: LayoutGrid },
  { href: '/supplier-onboarding', label: '供应商入驻', icon: UploadCloud },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
              {navItems.map((item) => (
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
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:hidden">
            <SidebarTrigger asChild>
              <Button size="icon" variant="outline" className='h-8 w-8'><Bot size={16}/></Button>
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">Alitheia</h1>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-6">
            {children}
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
