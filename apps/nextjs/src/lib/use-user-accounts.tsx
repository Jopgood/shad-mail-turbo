import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useUserAccounts() {
  const trpc = useTRPC();
  return useQuery(trpc.mail.getUserAccounts.queryOptions());
}
