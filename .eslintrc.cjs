module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "next/core-web-vitals"
  ],  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    "@next/next/no-document-import-in-page": "off"
  },
};
