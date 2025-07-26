import { SvelteKitAuth } from '@auth/sveltekit';

export const authHandle = SvelteKitAuth({
	providers: []
}).handle;
