/* eslint-env node */
// ESLint v9+ Flat Config (CommonJS)
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const vuePlugin = require('eslint-plugin-vue');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  // 忽略文件
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'unpackage/**',
      'coverage/**',
      '*.min.js',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
    ],
  },

  // JavaScript 基础推荐
  js.configs.recommended,

  // TypeScript 与通用设置
  {
    files: ['**/*.{ts,tsx,js,vue}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        // Node
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        // 小程序/uni-app
        uni: 'readonly',
        wx: 'readonly',
        WechatMiniprogram: 'readonly',
        getCurrentPages: 'readonly',
        getApp: 'readonly',
        UniApp: 'readonly',
        UniHelper: 'readonly',
        App: 'readonly',
        Page: 'readonly',
        Component: 'readonly',
        AnyObject: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      'prefer-const': 'error',
    },
  },

  // 为声明文件关闭未使用变量校验
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },

  // Vue 3 支持
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: require('vue-eslint-parser'),
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {},
  },
  eslintConfigPrettier,
];
