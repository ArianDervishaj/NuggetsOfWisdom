import { getAdminUser } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { redirect, error } from '@sveltejs/kit';

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

        // You could store a session here or generate a token, but for simplicity:
        return {
            status: 200,
            body: { message: 'Login successful' }
        };
    } catch (err) {
        throw error(500, err.message);
    }
}
