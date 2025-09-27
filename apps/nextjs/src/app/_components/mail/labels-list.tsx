import Link from "next/link";
import { IconInbox } from "@tabler/icons-react";

import { cn } from "@shad-mail/ui";
import { buttonVariants } from "@shad-mail/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shad-mail/ui/tooltip";

import type { NavProps } from "./nav";

export default function LabelsList({ isSidebarCollapsed, links }: NavProps) {
  return (
    <div
      data-collapsed={isSidebarCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isSidebarCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === null &&
                      "dark:bg-muted dark:text-foreground dark:hover:bg-muted dark:hover:text-foreground",
                  )}
                >
                  {link.icon ? (
                    <link.icon className="h-4 w-4" />
                  ) : (
                    <IconInbox className="h-4 w-4" />
                  )}
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                <div className="text-foreground dark:text-background">
                  {link.title}
                  {link.label && <span className="ml-2">{link.label}</span>}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === null &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              {link.icon ? (
                <link.icon className="mr-2 h-4 w-4" />
              ) : (
                <IconInbox className="mr-2 h-4 w-4" />
              )}
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === null &&
                      "text-background dark:text-muted-foreground",
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
