import { prefetch, trpc } from "~/trpc/server";
import Mail from "../_components/mail/mail";

export default function MailPage() {
  prefetch(trpc.mail.getAll.queryOptions());

  return (
    <div className="h-screen">
      <Mail navCollapsedSize={4} />
    </div>
  );
}
