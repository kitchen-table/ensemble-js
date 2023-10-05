import { defineConfig } from 'vite';
import { resolve } from 'path';
import packageJson from './package.json';
import preact from '@preact/preset-vite';
import svgr from '@svgr/rollup';
import tsconfigPaths from 'vite-tsconfig-paths';
import terser from '@rollup/plugin-terser';

const name = packageJson.name;

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [tsconfigPaths(), svgr(), preact()],
  build: {
    minify: !isDev && 'terser',
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name,
      fileName: (format) => `${name}.${format}.js`,
    },
    rollupOptions: isDev
      ? undefined
      : {
          plugins: [
            terser({
              format: { comments: false },
              mangle: {
                properties: true,
              },
            }),
          ],
        },
  },
  define: { 'process.env.NODE_ENV': isDev ? '"development"' : '"production"' },
});
