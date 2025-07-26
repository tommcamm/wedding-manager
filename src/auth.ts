import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';

export const { handle } = SvelteKitAuth({
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {}
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			authorize: async (credentials) => {
				// TODO: Implement proper authorization logic
				return null;
			}
		})
	]
});
