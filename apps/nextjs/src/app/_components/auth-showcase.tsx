import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@shad-mail/ui";
import { Button } from "@shad-mail/ui/button";
import { IconChevronRight } from "@tabler/icons-react";

import { auth, getSession } from "~/auth/server";
import SignIn from "./sign-in";

export async function AuthShowcase() {
  const session = await getSession();

  if (!session) {
    return <SignIn />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <div className="flex flex-col gap-2">
        <form>
          <Button
            variant="outline"
            className={cn("w-full gap-2")}
            formAction={async () => {
              "use server";
              await auth.api.signOut({
                headers: await headers(),
              });
              redirect("/");
            }}
          >
            Sign out
          </Button>
        </form>

        <Link href="/mail">
          <Button
            variant="outline"
            className={cn("group w-full justify-between")}
          >
            <span>Take me to my mail</span>
            <IconChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
