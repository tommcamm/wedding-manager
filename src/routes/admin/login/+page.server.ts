import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { auth } from '$lib/auth';
import type { Actions, PageServerLoad } from './$types';

// Validation schema
const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
	rememberMe: z.boolean().optional()
});

export const load: PageServerLoad = async ({ request }) => {
	// Check if user is already authenticated using Better Auth
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (session) {
			throw redirect(302, '/admin');
		}
	} catch {
		// Session check failed, continue to login page
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		// Parse form data
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const rememberMe = formData.get('rememberMe') === 'on';

		// Validate input
		const validation = loginSchema.safeParse({ email, password, rememberMe });

		if (!validation.success) {
			return fail(400, {
				email,
				errors: validation.error.flatten().fieldErrors,
				message: 'Please correct the errors below'
			});
		}

		try {
			// Attempt authentication using Better Auth server API
			const result = await auth.api.signInEmail({
				body: {
					email: validation.data.email,
					password: validation.data.password,
					rememberMe: validation.data.rememberMe
				},
				headers: request.headers
			});

			if (!result || !result.user) {
				// Return generic error message for security
				return fail(401, {
					email,
					message: 'Invalid credentials. Please check your email and password.'
				});
			}

			// Redirect to admin dashboard on success
			throw redirect(302, '/admin');
		} catch (error) {
			console.error('Authentication error:', error);

			// Return generic error message for security
			return fail(401, {
				email,
				message: 'Invalid credentials. Please check your email and password.'
			});
		}
	}
};
