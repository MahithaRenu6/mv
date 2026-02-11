import { build } from 'vite';

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
