// Flat config for ESLint v9+/v10 (replaces legacy .eslintrc.json).
// eslint-config-next v16 ships flat-config arrays directly, so no FlatCompat
// shim is needed. Mirrors the previous "next/core-web-vitals" + "next/typescript"
// setup plus the project's custom rule overrides.
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: ['node_modules/', '.next/', 'out/', 'build/', 'storybook-static/'],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'react-hooks/exhaustive-deps': 'error',
      'react/jsx-key': 'error',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      // react-hooks@7 (pulled in by eslint-config-next 16) newly promotes this
      // React-Compiler advisory to an error. It fires on legitimate, intentional
      // patterns here — initializing state from a prop in an effect
      // (ContentfulSlideout) and the SSR-safe portal mount (Portal). Keep it off
      // to match the project's prior lint intent rather than refactor working code.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // Storybook interactive stories legitimately call hooks inside `render`,
    // which the stricter react-hooks@7 rules-of-hooks flags. Scope the relaxation
    // to story files only so real components keep full rules-of-hooks enforcement.
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]

export default eslintConfig
