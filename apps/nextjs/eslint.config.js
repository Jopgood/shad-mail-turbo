import baseConfig, { restrictEnvAccess } from "@shad-mail/eslint-config/base";
import nextjsConfig from "@shad-mail/eslint-config/nextjs";
import reactConfig from "@shad-mail/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
