import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useEmails(maxResults = 25) {
  const trpc = useTRPC();
  return useQuery(
    trpc.mail.getMail.queryOptions({ maxResults, labelIds: ["INBOX"] }),
  );
}

export function useEmailBody(messageId: string | null) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.mail.getEmailBody.queryOptions({ messageId: messageId! }),
    enabled: !!messageId, // Only fetch when messageId is provided
  });
}
