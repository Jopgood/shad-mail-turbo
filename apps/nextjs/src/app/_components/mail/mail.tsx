"use client";

import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";

import type { Mail } from "@shad-mail/mail/types";
import { cn } from "@shad-mail/ui";
import { Input } from "@shad-mail/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@shad-mail/ui/resizable";
import { Separator } from "@shad-mail/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shad-mail/ui/tabs";
import { TooltipProvider } from "@shad-mail/ui/tooltip";

import { useNavLinks } from "~/lib/use-nav-links";
import { AccountSwitcher } from "./account-switcher";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
import Nav from "./nav";
import { useSidebarExpansion } from "./use-sidebar-expansion";

interface MailProps {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export default function Mail({
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  const { systemLinks, userLinks } = useNavLinks();

  // Use the sidebar expansion hook
  const { navPanelRef, handlePanelCollapse, handlePanelExpand } =
    useSidebarExpansion({
      isCollapsed,
      setIsCollapsed,
    });

  // Function to expand sidebar when collapsed icon is clicked
  const handleExpandSidebar = (onComplete?: () => void) => {
    if (isCollapsed && navPanelRef.current) {
      // Programmatically expand the panel
      navPanelRef.current.expand();
      setIsCollapsed(false);
      document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;

      // Call completion callback after expansion animation
      if (onComplete) {
        setTimeout(onComplete, 100);
      }
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          ref={navPanelRef}
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={handlePanelCollapse}
          onExpand={handlePanelExpand}
          className={cn(
            "flex flex-col",
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] flex-shrink-0 items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2",
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} />
          </div>
          <Separator />
          <div className="flex-1 overflow-y-auto">
            <Nav isSidebarCollapsed={isCollapsed} links={systemLinks} />
            <Separator />
            <Nav
              isSidebarCollapsed={isCollapsed}
              links={userLinks}
              isCollapseable
              onExpandSidebar={handleExpandSidebar}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={30}
          className="h-full min-w-0"
        >
          <Tabs defaultValue="all" className="flex h-full flex-col">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all">All mail</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[bakckdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0 flex-1">
              <MailList />
            </TabsContent>
            <TabsContent value="unread" className="m-0 flex-1">
              <MailList />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[2]}
          minSize={30}
          className="h-full"
        >
          <MailDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
