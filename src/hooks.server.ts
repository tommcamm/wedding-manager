import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { client } from '$lib/db';

// Initialize database connection

// Handle Paraglide middleware for internationalization
const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle: Handle = handleParaglide;

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
