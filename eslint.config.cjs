const tseslint = require('typescript-eslint');
const reacthooks = require('eslint-plugin-react-hooks');

const config = tseslint.config(
    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
        },
        plugins: {
            reacthooks
        },
        rules: {
            "reacthooks/exhaustive-deps": "warn",
            "reacthooks/rules-of-hooks": "error",
        }
    },
);

// allows running `node eslint.config.js ls` to view resolved config
if (process.argv[2] === "ls") {
    console.log("let config =", config)
}

module.exports = config;