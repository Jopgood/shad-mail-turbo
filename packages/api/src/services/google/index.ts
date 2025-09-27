import { TRPCError } from "@trpc/server";

import { and, eq } from "@shad-mail/db";
import { db } from "@shad-mail/db/client";
import { account } from "@shad-mail/db/schema";

import { getGoogleClient } from "./client";

export class GoogleService {
  static async getClientForUser(userId: string) {
    const accountResponse = await db.query.account.findFirst({
      where: and(eq(account.userId, userId), eq(account.providerId, "google")),
      columns: {
        accessToken: true,
        refreshToken: true,
      },
    });

    if (!accountResponse) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Google account not found",
      });
    }

    return getGoogleClient(accountResponse);
  }
}
