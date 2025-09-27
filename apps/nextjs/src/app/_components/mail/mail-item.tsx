import { formatDistanceToNow } from "date-fns";

import type { Mail } from "@shad-mail/mail/types";
import { useMail } from "@shad-mail/mail";
import { cn } from "@shad-mail/ui";
import { Badge } from "@shad-mail/ui/badge";

import { getBadgeVariantFromLabel } from "./utils";

export default function MailItem({ item }: { item: Mail }) {
  const mail = useMail((state) => state.mail);
  const setMail = useMail((state) => state.setMail);

  console.log(item);

  return (
    <button
      key={item.id}
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
        mail?.id === item.id && "bg-muted",
      )}
      onClick={() => setMail(item)}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="truncate font-semibold">{item.from}</div>
            {!item.isRead && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            )}
          </div>
          <div
            className={cn(
              "ml-auto text-xs",
              mail?.id === item.id
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {formatDistanceToNow(new Date(item.date), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="truncate text-xs font-medium">{item.subject}</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {item.preview}
      </div>
      {item.labels.length ? (
        <div className="flex items-center gap-2">
          {item.labels.map((label) => (
            <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
              {label}
            </Badge>
          ))}
        </div>
      ) : null}
    </button>
  );
}
