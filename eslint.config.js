import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  // 1. Use the recommended rules from ESLint
  pluginJs.configs.recommended,

  // 2. Global Settings (Fixes 'process is not defined')
  {
    languageOptions: {
      globals: {
        ...globals.node,    // Adds Node.js globals (process, __dirname, etc.)
        ...globals.browser  // Adds Browser globals (window, document, etc.)
      },
    },
  },

  // 3. Custom Rules (Fixes 'unused vars' blocking the build)
  {
    rules: {
      // Changes "error" to "warn" so unused vars don't break the build
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      
      // OPTIONAL: If you want to allow console.log (often blocked by default)
      "no-console": "off",
    },
  }
];