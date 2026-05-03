import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
);

// Inline alias plugin: rewrite `@/...` -> absolute path under ./src
// Mirrors the `paths` map in tsconfig.json so source files can keep using the
// `@/` alias without depending on a separate alias plugin.
function tsPathAlias() {
  const root = path.join(__dirname, 'src');
  return {
    name: 'ts-path-alias',
    resolveId(source, importer) {
      if (!source.startsWith('@/')) return null;
      const rel = source.slice(2); // drop `@/`
      const resolved = path.join(root, rel);
      // Let the next resolver in the chain pick up the actual file extension.
      return this.resolve(resolved, importer, { skipSelf: true });
    },
  };
}

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  // Sub-paths of any of the above (e.g. `zustand/middleware`) should also be
  // treated as external so they aren't pulled into the bundle.
  /^react($|\/)/,
  /^react-dom($|\/)/,
  /^next($|\/)/,
  /^lucide-react($|\/)/,
  /^date-fns($|\/)/,
  /^zustand($|\/)/,
  /^immer($|\/)/,
  /^clsx($|\/)/,
  /^tailwind-merge($|\/)/,
];

const plugins = [
  peerDepsExternal(),
  tsPathAlias(),
  resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    // The repo tsconfig is a Next.js typecheck-only config (`noEmit: true`).
    // Override the parts that block emit here. Type declarations are produced
    // by a separate `rollup-plugin-dts` pass below, so we don't emit `.d.ts`
    // from this plugin (avoids the outDir/file-location validation error).
    compilerOptions: {
      noEmit: false,
      declaration: false,
      declarationMap: false,
      jsx: 'react-jsx',
      module: 'esnext',
      moduleResolution: 'bundler',
      incremental: false,
      sourceMap: true,
      outDir: 'dist',
      // Disable `next` plugin for the lib build (it's irrelevant here).
      plugins: [],
    },
    exclude: [
      'node_modules/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.stories.tsx',
      '.storybook/**',
      'src/app/**',
    ],
  }),
];

const buildEntry = (input, outBase) => ({
  input,
  output: [
    {
      file: `dist/${outBase}.js`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: `dist/${outBase}.esm.js`,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins,
  external,
});

const dtsEntry = (input, outBase) => ({
  input,
  output: [{ file: `dist/${outBase}.d.ts`, format: 'es' }],
  plugins: [tsPathAlias(), dts({ tsconfig: './tsconfig.json' })],
  external,
});

export default [
  buildEntry('src/index.ts', 'index'),
  buildEntry('src/previews.ts', 'previews'),
  buildEntry('src/live-updates.ts', 'live-updates'),
  dtsEntry('src/index.ts', 'index'),
  dtsEntry('src/previews.ts', 'previews'),
  dtsEntry('src/live-updates.ts', 'live-updates'),
];
