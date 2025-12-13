import { defineConfig } from 'vite';
import garurVite from '../intr/vite-plugin';// If you put it in root
export default defineConfig({ plugins: [garurVite()] });