import prettier from "eslint-plugin-prettier/recommended";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [".wrangler/**", "coverage/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      // Cloudflare Workers runs browser-like globals (fetch, crypto, Response…),
      // not Node's. TypeScript already knows these via @cloudflare/workers-types,
      // so no-undef would just be redundant — turned off below.
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  {
    // A runtime import from discord-api-types pulls its whole CommonJS bundle
    // (~200 KB) into the worker — see src/utils/discord.ts.
    files: ["src/**/*.ts"],
    ignores: ["src/utils/discord.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "discord-api-types/v10",
              message:
                "Use `import type` here; take runtime constants from src/utils/discord.ts.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  prettier,
);
