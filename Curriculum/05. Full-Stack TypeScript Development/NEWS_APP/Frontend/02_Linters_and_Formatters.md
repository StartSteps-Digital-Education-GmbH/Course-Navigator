### Guide 2: Setting Up Linters and Formatters for a React Project

This guide focuses on configuring ESLint and Prettier for a React project using TypeScript. While some configurations are inspired by your backend setup, this guide ensures a React-optimized environment for clean and consistent code.

---

### Step 1: Install Required Packages

Start by installing ESLint, Prettier, and relevant plugins for TypeScript and React.

```bash
# Install ESLint and Prettier
npm install eslint prettier --save-dev

# Install ESLint plugins for React, TypeScript, and Prettier
npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-prettier eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y --save-dev
```

---

### Step 2: Initialize ESLint Configuration

Run the ESLint initialization command to set up a basic configuration:

```bash
npx eslint --init
```

When prompted:
- **How would you like to use ESLint?** Choose `To check syntax, find problems, and enforce code style`.
- **What type of modules does your project use?** Choose `ES Modules`.
- **Which framework does your project use?** Select `React`.
- **Does your project use TypeScript?** Select `Yes`.
- **Where does your code run?** Choose `Browser`.
- **How would you like to define a style for your project?** Select `Use a popular style guide` and then choose `Standard`.
- **What format do you want your config file to be in?** Choose `JavaScript`.

This generates a starter ESLint configuration file (`.eslintrc.js`).

---

### Step 3: Customize the ESLint Configuration

Replace the content of `.eslintrc.js` with the following React-optimized ESLint configuration:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external', 'internal']],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'jsx-a11y/anchor-is-valid': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
```

---

### Step 4: Add Prettier Configuration

Create a `.prettierrc` file for Prettier with these settings:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80
}
```

Additionally, add a `.prettierignore` file to exclude build artifacts:

```
node_modules
build
dist
```

---

### Step 5: Integrate ESLint and Prettier

Install the `eslint-config-prettier` package to disable ESLint rules that conflict with Prettier:

```bash
npm install eslint-config-prettier --save-dev
```

Update the `extends` section in `.eslintrc.js` to ensure compatibility:

```javascript
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:import/errors',
  'plugin:import/warnings',
  'plugin:import/typescript',
  'plugin:jsx-a11y/recommended',
  'plugin:prettier/recommended',
],
```

---

### Step 6: Add Linting and Formatting Scripts

Update your `package.json` to include scripts for linting and formatting:

```json
"scripts": {
  "lint": "eslint 'src/**/*.{js,jsx,ts,tsx}'",
  "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,scss}'"
}
```

---

### Step 7: Test Your Setup

Run the following commands to ensure everything works:
- **Lint the project:** `npm run lint`
- **Format the project:** `npm run format`

If no errors are reported, your linters and formatters are correctly set up!

---

### Additional Notes
- For better integration, consider adding ESLint and Prettier extensions to your editor (e.g., VSCode).
- Enable "format on save" in your editor settings to automatically apply Prettier rules.
