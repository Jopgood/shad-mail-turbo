import { TRPCError } from "@trpc/server";
import { google } from "googleapis";
import { z } from "zod/v4";

import type { Mail } from "@shad-mail/mail/types";
import { eq } from "@shad-mail/db";
import { account } from "@shad-mail/db/schema";

import mail from "../mail.json";
import { GoogleService } from "../services/google";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { extractEmailBody, parseEmailData } from "../utils/email";

export const mailRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    // Simulate a database delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return mail as unknown as Mail[];
  }),

  getUserAccounts: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userAccounts = await ctx.db.query.account.findMany({
        where: eq(account.userId, ctx.session.user.id),
        columns: {
          id: true,
          providerId: true,
          accountId: true,
        },
      });

      // Enrich accounts with actual Gmail addresses
      const enrichedAccounts = await Promise.all(
        userAccounts.map(async (acc) => {
          let email = acc.accountId;

          // For Google accounts, fetch the actual Gmail address
          if (acc.providerId === "google") {
            try {
              const googleClient = await GoogleService.getClientForUser(
                ctx.session.user.id,
              );

              if (googleClient) {
                const gmail = google.gmail({ version: "v1", auth: googleClient });
                const emailResponse = await gmail.users.getProfile({ userId: "me" });

                if (emailResponse.data.emailAddress) {
                  email = emailResponse.data.emailAddress;
                }
              }
            } catch (error) {
              console.error(`Failed to fetch Gmail address for account ${acc.id}:`, error);
              // Fall back to accountId if Gmail API fails
            }
          }

          return {
            id: acc.id,
            providerId: acc.providerId,
            accountId: acc.accountId,
            email,
            label: `${acc.providerId} (${email})`,
          };
        }),
      );

      return enrichedAccounts;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user accounts",
        cause: error,
      });
    }
  }),

  getLabels: protectedProcedure.query(async ({ ctx }) => {
    try {
      const googleClient = await GoogleService.getClientForUser(
        ctx.session.user.id,
      );
      if (!googleClient) throw new Error("No client found");
      const gmail = google.gmail({
        version: "v1",
        auth: googleClient,
      });

      const labelsResponse = await gmail.users.labels.list({
        userId: "me",
      });

      if (!labelsResponse.data.labels) {
        return [];
      }

      const labelLinks = labelsResponse.data.labels
        .filter((label): label is { id: string; name: string } =>
          Boolean(label.id && label.name),
        )
        .map((label) => ({
          title: label.name, // Now TypeScript knows this is string
          variant: "ghost" as const,
          label: "0",
          labelId: label.id, // Now TypeScript knows this is string
        }));

      return labelLinks.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error("Error in getLabels:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch Gmail labels",
        cause: error,
      });
    }
  }),

  // Get unread count for a specific label
  getLabelCount: protectedProcedure
    .input(z.object({ labelId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const googleClient = await GoogleService.getClientForUser(
          ctx.session.user.id,
        );
        const gmail = google.gmail({ version: "v1", auth: googleClient });

        const threadsResponse = await gmail.users.labels.get({
          userId: "me",
          id: input.labelId,
        });

        return {
          labelId: input.labelId,
          count: threadsResponse.data.threadsUnread ?? 0, // Changed to unread
        };
      } catch (error) {
        console.error(
          `Error fetching count for label ${input.labelId}:`,
          error,
        );
        return {
          labelId: input.labelId,
          count: 0,
        };
      }
    }),

  getMail: protectedProcedure
    .input(
      z.object({
        maxResults: z.int(),
        labelIds: z.array(z.string()),
        pageToken: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const googleClient = await GoogleService.getClientForUser(
          ctx.session.user.id,
        );

        const gmail = google.gmail({ version: "v1", auth: googleClient });

        const messagesResponse = await gmail.users.messages.list({
          userId: "me",
          maxResults: input.maxResults,
          pageToken: input.pageToken,
          labelIds: input.labelIds,
        });

        const messageIds = messagesResponse.data.messages ?? [];

        // Fetch detailed info for each message
        const emailPromises = messageIds
          .filter((message): message is { id: string } => Boolean(message.id))
          .map(async (message) => {
            const messageDetail = await gmail.users.messages.get({
              userId: "me",
              id: message.id,
              format: "full",
            });

            return parseEmailData(messageDetail.data);
          });

        const emails = await Promise.all(emailPromises);

        return {
          emails,
          nextPageToken: messagesResponse.data.nextPageToken,
        };
      } catch (error) {
        if (typeof error == "string") {
          throw new Error("Failed to fetch emails:error" + error);
        }
      }
    }),

  getEmailBody: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const googleClient = await GoogleService.getClientForUser(
          ctx.session.user.id,
        );

        const gmail = google.gmail({ version: "v1", auth: googleClient });

        const messageDetail = await gmail.users.messages.get({
          userId: "me",
          id: input.messageId,
          format: "full",
        });

        return {
          id: input.messageId,
          body: extractEmailBody(messageDetail.data),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch email body",
          cause: error,
        });
      }
    }),
});
