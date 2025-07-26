import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	if (!session) {
		throw redirect(302, '/admin/login');
	}

	return { session };
};
