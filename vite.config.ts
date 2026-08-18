import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react';

// Relative asset URLs work locally and under a GitHub Pages project URL such as /seal-gen/.
export default defineConfig({ plugins:[react()], base: './' });
