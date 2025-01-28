import { getAdminUser, getSemesters, getCourses } from '$lib/server/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { error } from '@sveltejs/kit';
import cookie from 'cookie';
import { JWT_SECRET } from '$env/static/private';

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET is not defined');
}

// Helper function to fetch all semesters with their courses
async function getSemestersWithCourses() {
	const semesters = await getSemesters();
	const semestersWithCourses = await Promise.all(
		semesters.map(async (semester) => {
			const courses = await getCourses(semester.name); // Use the name or ID, depending on your database schema
			return { ...semester, courses };
		})
	);
	return semestersWithCourses;
}

// POST: Handle login
export async function POST({ request }) {
	const { username, password } = await request.json();

	try {
		const user = await getAdminUser(username);

		if (!user) {
			throw error(400, 'Invalid credentials');
		}

		// Compare passwords
		const match = await bcrypt.compare(password, user.password_hash);

		if (!match) {
			throw error(400, 'Invalid credentials');
		}

		// Generate a JWT token
		const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
			expiresIn: '1h'
		});

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

// GET: Validate token and return data
export async function GET({ cookies, url }) {
	const token = cookies.get('auth_token');

	// Token verification
	if (!token) {
		return new Response(JSON.stringify({ error: 'Not authenticated' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, JWT_SECRET);

		// Check if the request is for all semesters and courses
		if (url.pathname === '/admin') {
			const semestersWithCourses = await getSemestersWithCourses();
			return new Response(JSON.stringify(semestersWithCourses), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Default response
		return new Response(JSON.stringify({ token, user: decoded }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Invalid token' }), {
			status: 401,
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
