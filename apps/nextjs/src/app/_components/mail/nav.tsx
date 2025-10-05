import type { Icon } from "@tabler/icons-react";
import { useState } from "react";
import { IconDots } from "@tabler/icons-react";

import { Button } from "@shad-mail/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shad-mail/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shad-mail/ui/tooltip";

import LabelsList from "./labels-list";

export interface NavProps {
  isSidebarCollapsed: boolean;
  isCollapseable?: boolean;
  onExpandSidebar?: (onComplete?: () => void) => void; // Updated to support callback
  links: {
    title: string;
    label?: string;
    icon?: Icon;
    variant:
      | "ghost"
      | "link"
      | "primary"
      | "destructive"
      | "outline"
      | "secondary"
      | null
      | undefined;
    labelId: string;
  }[];
}

export default function Nav({
  links,
  isSidebarCollapsed,
  isCollapseable = false,
  onExpandSidebar,
}: NavProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Handle collapsed state click - expand sidebar and auto-open
  const handleCollapsedClick = () => {
    if (isSidebarCollapsed && onExpandSidebar) {
      // Expand sidebar and automatically open the section
      onExpandSidebar(() => {
        setIsOpen(true);
      });
    } else {
      setIsOpen(!isOpen);
    }
  };

  return isCollapseable ? (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group flex flex-col py-2 data-[collapsed=true]:py-2"
    >
      <div className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {isSidebarCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                onClick={handleCollapsedClick}
              >
                <IconDots className="h-4 w-4" />
                <span className="sr-only">More labels</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">More labels</TooltipContent>
          </Tooltip>
        ) : (
          <CollapsibleTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="justify-start dark:text-white dark:hover:bg-muted dark:hover:text-white"
              onClick={handleCollapsedClick}
            >
              <IconDots className="mr-2 h-4 w-4" />
              <span className="ml-auto text-foreground dark:text-white">
                {isOpen ? "Less" : "More"}
              </span>
            </Button>
          </CollapsibleTrigger>
        )}
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <LabelsList links={links} isSidebarCollapsed={isSidebarCollapsed} />
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <LabelsList links={links} isSidebarCollapsed={isSidebarCollapsed} />
  );
}
