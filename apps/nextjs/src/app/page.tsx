import { HydrateClient } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";

export default function HomePage() {
  return (
    <HydrateClient>
      <main className="container relative h-screen">
        {/* Header section - positioned at top */}
        <div className="flex flex-col items-center justify-center pb-8 pt-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Shad
            <span className="inline-block bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
              Mail
            </span>
          </h1>
        </div>

        {/* SignIn - absolutely centered on entire screen */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
