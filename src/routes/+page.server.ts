import { getSemesters } from '$lib/server/db';

/**
 * Loads all semesters from the database.
 * @returns {Promise<Object>} A promise that resolves to an object containing the fetched semesters.
 * @throws {Error} If there is an error fetching the semesters.
 */
export const load = async () => {
	try {
		const semesters = await getSemesters();
		return {
			semesters
		};
	} catch (err) {
		throw err;
	}
};
