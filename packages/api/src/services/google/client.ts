import { authEnv } from "@shad-mail/auth/env";
import { OAuth2Client } from "google-auth-library";

export function getGoogleClient(account: {
  accessToken: string | null;
  refreshToken: string | null;
}) {
  if (!account.accessToken || !account.refreshToken) {
    console.log("No access token or refresh token");
    return;
  }

  const oauth2Client = new OAuth2Client({
    clientId: authEnv().GOOGLE_CLIENT_ID,
    clientSecret: authEnv().GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/auth/google/callback",
  });

  // Set the credentials
  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  return oauth2Client;
}
