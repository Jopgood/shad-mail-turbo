// hooks/useNavLinks.ts
import { useEffect, useMemo, useState } from "react";
import {
  IconArchive,
  IconInbox,
  IconSend,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import type { NavProps } from "../app/_components/mail/nav";
import { useTRPC } from "~/trpc/react";

export function useNavLinks() {
  const [systemLinks, setSystemLinks] = useState<NavProps["links"]>([]);
  const trpc = useTRPC();

  // Get user labels
  const { data: labels, isLoading: labelsLoading } = useQuery(
    trpc.mail.getLabels.queryOptions(),
  );

  // System label counts - these are the important ones we want to load immediately
  const { data: inboxCount } = useQuery(
    trpc.mail.getLabelCount.queryOptions(
      { labelId: "INBOX" },
      { enabled: !labelsLoading },
    ),
  );

  const { data: socialCount } = useQuery(
    trpc.mail.getLabelCount.queryOptions(
      { labelId: "CATEGORY_SOCIAL" },
      { enabled: !labelsLoading },
    ),
  );

  const { data: promotionsCount } = useQuery(
    trpc.mail.getLabelCount.queryOptions(
      { labelId: "CATEGORY_PROMOTIONS" },
      { enabled: !labelsLoading },
    ),
  );

  const { data: updatesCount } = useQuery(
    trpc.mail.getLabelCount.queryOptions(
      { labelId: "CATEGORY_UPDATES" },
      { enabled: !labelsLoading },
    ),
  );

  const { data: forumsCount } = useQuery(
    trpc.mail.getLabelCount.queryOptions(
      { labelId: "CATEGORY_FORUMS" },
      { enabled: !labelsLoading },
    ),
  );

  // No longer fetching counts for user labels

  // Build system links
  useEffect(() => {
    const systemNavLinks: NavProps["links"] = [
      {
        title: "Inbox",
        label: String(inboxCount?.count ?? 0),
        icon: IconInbox,
        variant: null,
        labelId: "INBOX",
      },
      {
        title: "Social",
        label: String(socialCount?.count ?? 0),
        icon: IconUsers,
        variant: "ghost",
        labelId: "CATEGORY_SOCIAL",
      },
      {
        title: "Promotions",
        label: String(promotionsCount?.count ?? 0),
        icon: IconArchive,
        variant: "ghost",
        labelId: "CATEGORY_PROMOTIONS",
      },
      {
        title: "Updates",
        label: String(updatesCount?.count ?? 0),
        icon: IconSend,
        variant: "ghost",
        labelId: "CATEGORY_UPDATES",
      },
      {
        title: "Forums",
        label: String(forumsCount?.count ?? 0),
        icon: IconTrash,
        variant: "ghost",
        labelId: "CATEGORY_FORUMS",
      },
    ];

    setSystemLinks(systemNavLinks);
  }, [inboxCount, socialCount, promotionsCount, updatesCount, forumsCount]);

  // Build user links (no counts, will be hidden in accordion later)
  const userLinks = useMemo(() => {
    if (!labels) return [];

    return labels.map((label) => ({
      ...label,
      label: undefined, // No counts for user labels
    }));
  }, [labels]);

  return {
    systemLinks,
    userLinks,
    isLoading: labelsLoading,
    // Helper to get total unread count (system labels only)
    totalUnreadCount:
      (inboxCount?.count ?? 0) +
      (socialCount?.count ?? 0) +
      (promotionsCount?.count ?? 0) +
      (updatesCount?.count ?? 0) +
      (forumsCount?.count ?? 0),
  };
}
