import { getNote } from '$lib/server/db';

export const load = async ({ params }) => {
	try {
		const { note_name } = params;
		const note = await getNote(note_name);

		return {
			note
		};
	} catch (err) {
		throw err;
	}
};
