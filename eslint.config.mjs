import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        chrome: 'readonly',
      }
    },
    
  },
  pluginJs.configs.recommended,
  
  //js.configs.recommended,
    // {
    //     rules: {
    //         "no-unused-vars": "warn",
    //         "no-undef": "error",
    //         "no-unused-expressions": "warn",
    //         "no-unused-labels": "warn",
    //     }
    // },
];