import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginImport from "eslint-plugin-import"; // 👈 import the plugin

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: eslintPluginImport, // 👈 register the plugin
    },
    rules: {
      // ✅ React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // ✅ React Refresh (Vite HMR)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // ✅ Import rules (with case-sensitivity)
      "import/no-unresolved": ["error", { caseSensitive: true }],
      "import/no-duplicates": "warn",
      "import/newline-after-import": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  }
);
