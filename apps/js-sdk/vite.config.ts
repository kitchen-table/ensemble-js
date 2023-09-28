import { defineConfig } from 'vite';
import { resolve } from 'path';
import packageJson from './package.json';
import preact from '@preact/preset-vite';
import svgr from '@svgr/rollup';
import tsconfigPaths from 'vite-tsconfig-paths';

const name = packageJson.name;

export default defineConfig({
  plugins: [tsconfigPaths(), svgr(), preact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name,
      fileName: (format) => `${name}.${format}.js`,
    },
  },
});
