import { create } from "zustand";

import type { Mail } from "./types";

interface MailStore {
  mail: Mail | null;
  setMail: (mail: Mail) => void;
}

export const useMail = create<MailStore>((set) => ({
  mail: null,
  setMail: (mail: Mail) => set({ mail }),
}));
