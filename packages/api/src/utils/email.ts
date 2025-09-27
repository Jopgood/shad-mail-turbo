import type { gmail_v1 } from "googleapis";

import type { Mail } from "@shad-mail/mail/types";

type Message = gmail_v1.Schema$Message;

export function parseFromHeader(fromHeader: string) {
  // Regex patterns for common email formats:
  // "Name" <email@domain.com>
  // Name <email@domain.com>
  // email@domain.com
  const nameEmailPattern = /^"?([^"<]+?)"?\s*<([^>]+)>$/;
  const emailOnlyPattern = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  const trimmed = fromHeader.trim();

  // Try name + email format first
  const nameEmailMatch = nameEmailPattern.exec(trimmed);
  if (nameEmailMatch) {
    const [, name, email] = nameEmailMatch;
    return {
      name: name?.trim() ?? "",
      email: email?.trim() ?? "",
      displayName: name?.trim() ?? email?.split("@")[0] ?? fromHeader,
    };
  }

  // Try email-only format
  const emailMatch = emailOnlyPattern.exec(trimmed);
  if (emailMatch) {
    const [, email] = emailMatch;
    return {
      name: "",
      email: email ?? "",
      displayName: email?.split("@")[0] ?? fromHeader,
    };
  }

  // Fallback - treat as display name
  return {
    name: "",
    email: fromHeader,
    displayName: fromHeader,
  };
}

// Helper function to parse email data
export function parseEmailData(message: Message): Mail {
  const headers = message.payload?.headers ?? [];

  const getHeader = (name: string) =>
    headers.find((h) =>
      h.name?.toLowerCase() === name.toLowerCase()
    )?.value ?? "";

  const fromHeader = getHeader("From");
  const fromParsed = parseFromHeader(fromHeader);

  return {
    id: message.id ?? "",
    threadId: message.threadId ?? "",
    subject: getHeader("Subject"),
    from: fromParsed.displayName, // Just the name or username
    fromEmail: fromParsed.email, // Full email if needed
    fromName: fromParsed.name, // Just the name part
    fromRaw: fromHeader, // Original header if needed
    to: getHeader("To"),
    date: getHeader("Date"),
    snippet: message.snippet ?? "",
    preview: getEmailPreview(message.payload),
    labels: message.labelIds ?? [],
    isRead: message.labelIds ? !message.labelIds.includes("UNREAD") : false,
    isStarred: message.labelIds ? message.labelIds.includes("STARRED") : false,
    timestamp: message.internalDate ?? Date.now().toString(),
  };
}

function getEmailPreview(
  payload: gmail_v1.Schema$MessagePart | undefined,
): string {
  if (!payload) return "";

  // Try to find text/plain part first
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64")
          .toString("utf-8")
          .slice(0, 200);
      }
    }
    // If no text/plain, try text/html
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        const html = Buffer.from(part.body.data, "base64").toString("utf-8");
        // Basic HTML stripping - just remove tags for preview
        return html.replace(/<[^>]*>/g, "").slice(0, 200);
      }
    }
  }

  // Fallback to body data if no parts
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64")
      .toString("utf-8")
      .slice(0, 200);
  }

  return "";
}

export function extractEmailBody(message: Message): { html: string; text: string } {
  if (!message.payload) {
    return { html: "", text: "" };
  }

  let htmlContent = "";
  let textContent = "";

  function extractFromPart(part: gmail_v1.Schema$MessagePart) {
    if (part.mimeType === "text/html" && part.body?.data) {
      htmlContent = Buffer.from(part.body.data, "base64").toString("utf-8");
    } else if (part.mimeType === "text/plain" && part.body?.data) {
      textContent = Buffer.from(part.body.data, "base64").toString("utf-8");
    }

    // Recursively check nested parts (for multipart messages)
    if (part.parts) {
      for (const nestedPart of part.parts) {
        extractFromPart(nestedPart);
      }
    }
  }

  // Check if the main payload has parts (multipart message)
  if (message.payload.parts) {
    for (const part of message.payload.parts) {
      extractFromPart(part);
    }
  } else {
    // Single part message
    extractFromPart(message.payload);
  }

  return {
    html: htmlContent,
    text: textContent,
  };
}
