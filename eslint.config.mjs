// Updated eslint.config.mjs to work on Vercel
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Explicitly specify we don't need TypeScript
  recommendedConfig: { extends: ["eslint:recommended"] },
});

// Use directly extends without TypeScript dependency
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    languageOptions: {
      // Disable TypeScript parsing requirements
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2022,
      },
    },
  },
];

export default eslintConfig;