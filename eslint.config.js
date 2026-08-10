import { voxpelli } from '@voxpelli/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...voxpelli({ noMocha: true }),
  {
    rules: {
      '@stylistic/indent': ['error', 2, {
        flatTernaryExpressions: true,
      }],
    },
  },
]);
