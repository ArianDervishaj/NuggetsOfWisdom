import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/db';
import { insertNewNotes } from '$lib/server/db';

export async function POST({ request }) {
	try {
		// Parse the incoming form data
		const formData = await request.formData();
		const course_name = formData.get('course_name');
		const name = formData.get('name');
		const file = formData.get('file');

		// Ensure all required fields are provided
		if (!course_name || !name || !file) {
			return json({ error: 'Missing required fields.' }, { status: 400 });
		}

		// Check that the file is indeed an instance of File
		if (!(file instanceof File)) {
			return json({ error: 'Uploaded file is not valid.' }, { status: 400 });
		}

		// Upload the file to Supabase storage (uploads bucket)
		const { data, error } = await supabase.storage
			.from('uploads')
			.upload(`notes/${file.name}`, file.stream(), {
				cacheControl: '3600',
				upsert: false,
				duplex: 'half'
			});

		if (error) {
			return json({ error: error.message }, { status: 500 });
		}

		// Get the public URL for the uploaded file
		const publicUrl = supabase.storage.from('uploads').getPublicUrl(data.path).data.publicUrl;

		// Insert metadata into the database with the public URL of the file
		await insertNewNotes(course_name, name, publicUrl);

		return json({ success: true });
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to upload note.' }, { status: 500 });
	}
}
