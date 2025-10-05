import { IconBrandGoogle, IconBrandGithub, IconUser, IconMail } from "@tabler/icons-react";

export function getProviderIcon(providerId: string) {
  switch (providerId.toLowerCase()) {
    case "google":
      return <IconBrandGoogle className="h-4 w-4" />;
    case "github":
      return <IconBrandGithub className="h-4 w-4" />;
    default:
      return <IconUser className="h-4 w-4" />;
  }
}

export function getProviderName(providerId: string) {
  switch (providerId.toLowerCase()) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    default:
      return providerId;
  }
}