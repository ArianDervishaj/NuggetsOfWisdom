import { writeFile } from 'fs/promises';
import path from 'path';
import { json } from '@sveltejs/kit';
import { insertNewNotes } from '$lib/server/db';

export async function POST({ request }) {
	try {
		// Parse the incoming form data
		const formData = await request.formData();
		const course_name = formData.get('course_name');
		const name = formData.get('name');
		const file = formData.get('file') as File;

		if (!course_name || !name || !file) {
			return json({ error: 'Missing required fields.' }, { status: 400 });
		}

		// Define the file path for storing the file in 'static/uploads'
		const filePath = path.join('static', 'uploads', `${file.name}`);
		// This resolves the full path for saving the file on the server
		const fullPath = path.resolve(filePath);

		// Save the file to the server
		const fileBuffer = Buffer.from(await file.arrayBuffer());
		await writeFile(fullPath, fileBuffer);

		// Insert metadata into the database without the 'static' part in the file path
		const relativeFilePath = path.join('uploads', `${file.name}`);
		await insertNewNotes(course_name, name, relativeFilePath);

		return json({ success: true });
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to upload note.' }, { status: 500 });
	}
}
