import { ScrollArea } from "@shad-mail/ui/scroll-area";

import { useEmails } from "~/lib/use-mail";
import MailItem from "./mail-item";
import MailItemSkeleton from "./mail-item-skeleton";

export function MailList() {
  const { data, isPending, error, isError } = useEmails(25);

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {isPending ? (
          <MailItemSkeleton />
        ) : isError || !data ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load mail items
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error?.message}
            </p>
          </div>
        ) : (
          data.emails.map((item) => <MailItem key={item.id} item={item} />)
        )}
      </div>
    </ScrollArea>
  );
}
