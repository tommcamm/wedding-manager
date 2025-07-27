import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { client } from '$lib/db';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/auth';
import { sequence } from '@sveltejs/kit/hooks';

// Initialize database connection

// Handle Paraglide middleware for internationalization
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

export const handle: Handle = sequence(paraglideHandle, async ({ event, resolve }) =>
	svelteKitHandler({ event, resolve, auth })
);

/**
 * Handles server shutdown to properly close database connections
 */
export async function handleServerShutdown() {
	// Close PostgreSQL connection
	try {
		console.log('Closing database connections...');
		await client.end();
		console.log('Database connections closed successfully');
	} catch (error) {
		console.error('Error closing database connections:', error);
	}
}
