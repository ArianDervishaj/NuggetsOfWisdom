import { supabase } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import cookie from 'cookie';


// POST: Handle login
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

// GET: Validate token and return user data
export async function GET({ cookies }) {
	const token = cookies.get('auth_token');

	if (!token) {
		return new Response(JSON.stringify({ error: 'Not authenticated' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const { data, error: authError } = await supabase.auth.getUser(token);

		if (authError || !data.user) {
			throw error(401, 'Invalid token');
		}

		return new Response(JSON.stringify(data.user), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'An error occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

// DELETE: Logout by clearing the auth cookie
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
