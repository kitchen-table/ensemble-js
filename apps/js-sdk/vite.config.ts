import { defineConfig } from 'vite';
import { resolve } from 'path';
import packageJson from './package.json';

const name = packageJson.name;

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name,
      fileName: (format) => `${name}.${format}.js`,
    },
  },
});
