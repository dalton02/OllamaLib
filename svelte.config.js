import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// adapter options go here
		})
	},
	alias: {
		$components: resolve('src/components'),
		$lib: resolve('src/lib'),
		$static: resolve('static'),
	},
};

export default config;