import baseConfig from "@shad-mail/eslint-config/base";
import reactConfig from "@shad-mail/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
