export interface Mail {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  fromEmail: string;
  fromName: string;
  fromRaw: string;
  to: string;
  date: string;
  snippet: string;
  preview: string;
  labels: string[];
  isRead: boolean;
  isStarred: boolean;
  timestamp: string;
}
