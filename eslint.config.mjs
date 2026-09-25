import js from "@eslint/js";
import globals from "globals";

export default [
    {
        files: [
            "**/*.js"
        ],
        ignores: [
            "node_modules/**",
            "coverage/**"
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs"
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "warn"
        }
    },

    {
        files: [
            "server.js",
            "routes/**/*.js",
            "models/**/*.js",
            "tests/**/*.js",
            "test/**/*.js"
        ],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            }
        }
    },

    {
        files: [
            "public/**/*.js"
        ],
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    }
];