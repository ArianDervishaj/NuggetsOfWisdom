import { getNotes } from '$lib/server/db';

/**
 * Loads notes for a specific course based on the provided course name from the URL parameters.
 * @param {Object} param0 - The parameters object.
 * @param {Object} param0.params - The URL parameters containing the course name.
 * @param {string} param0.params.course - The name of the course for which notes are to be fetched.
 * @returns {Promise<Object>} A promise that resolves to an object containing the fetched notes.
 * @throws {Error} If there is an error fetching the notes.
 */
export const load = async ({ params }) => {
	try {
		const { course } = params;
		const notes = await getNotes(course);

		return {
			notes
		};
	} catch (err) {
		throw err;
	}
};
