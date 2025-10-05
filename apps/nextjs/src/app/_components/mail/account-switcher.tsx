"use client";

import * as React from "react";

import { cn } from "@shad-mail/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shad-mail/ui/select";

import { useUserAccounts } from "~/lib/use-user-accounts";
import { getProviderIcon, getProviderName } from "./provider-icons";

interface Account {
  id: string;
  providerId: string;
  email: string;
  label: string;
}

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const { data: accounts, isLoading, error } = useUserAccounts();
  const [selectedAccount, setSelectedAccount] = React.useState<string>("");

  // Set initial selected account when data loads or validate current selection
  React.useEffect(() => {
    if (!accounts || accounts.length === 0) {
      setSelectedAccount("");
      return;
    }

    // Set initial selection or reset if current selection is invalid
    if (
      !selectedAccount ||
      !accounts.find((a: Account) => a.id === selectedAccount)
    ) {
      setSelectedAccount(accounts[0]!.id);
    }
  }, [accounts, selectedAccount]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center p-2",
          isCollapsed && "h-9 w-9",
        )}
      >
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      </div>
    );
  }

  if (error || !accounts || accounts.length === 0) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center p-2 text-sm text-muted-foreground",
          isCollapsed && "h-9 w-9",
        )}
      >
        {isCollapsed ? "?" : "No accounts"}
      </div>
    );
  }

  const currentAccount = accounts.find(
    (account: Account) => account.id === selectedAccount,
  );

  return (
    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
      <SelectTrigger
        className={cn(
          "flex w-full items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {currentAccount && getProviderIcon(currentAccount.providerId)}
          <span className={cn("ml-2 truncate", isCollapsed && "hidden")}>
            {currentAccount && currentAccount.email}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account: Account) => (
          <SelectItem key={account.id} value={account.id}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {getProviderIcon(account.providerId)}
              <div className="flex flex-col">
                <span className="font-medium">
                  {getProviderName(account.providerId)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {account.email}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
