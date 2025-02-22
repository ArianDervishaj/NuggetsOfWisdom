import { supabase } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import cookie from 'cookie';

/**
 * Handles POST requests for user login.
 * @param {Object} param0 - The request object.
 * @param {Request} param0.request - The HTTP request object containing user credentials.
 * @returns {Promise<Response>} A promise that resolves to an HTTP response with login status or error.
 */
export async function POST({ request }) {
	const { email, password } = await request.json();
	try {
		const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

		if (authError) {
			throw error(400, authError.message);
		}

		const token = data.session.access_token;

		// Set token as a secure HTTP-only cookie
		return new Response(
			JSON.stringify({ message: 'Login successful', token }), // Return token for frontend usage
			{
				status: 200,
				headers: {
					'Set-Cookie': cookie.serialize('auth_token', token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'strict',
						maxAge: 60 * 60, // 1 hour
						path: '/'
					}),
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message || 'An error occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Handles DELETE requests to logout by clearing the auth cookie.
 * @returns {Promise<Response>} A promise that resolves to an HTTP response indicating successful logout.
 */
export async function DELETE() {
	return new Response(null, {
		status: 200,
		headers: {
			'Set-Cookie': cookie.serialize('auth_token', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				expires: new Date(0), // Expire the cookie immediately
				path: '/'
			}),
			'Content-Type': 'application/json'
		}
	});
}
