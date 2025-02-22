import { getNote } from '$lib/server/db';

/**
 * Loads a note based on the provided note name from the URL parameters.
 * @param {Object} param0 - The parameters object.
 * @param {Object} param0.params - The URL parameters containing the note name.
 * @param {string} param0.params.note_name - The name of the note to be fetched.
 * @returns {Promise<Object>} A promise that resolves to an object containing the fetched note.
 * @throws {Error} If there is an error fetching the note.
 */
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
