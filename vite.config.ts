import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
export default defineConfig({
	plugins: [sveltekit()],

});
