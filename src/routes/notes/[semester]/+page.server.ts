import { getCourses } from '$lib/server/db';

/**
 * Loads courses for a specific semester based on the provided semester name from the URL parameters.
 * @param {Object} param0 - The parameters object.
 * @param {Object} param0.params - The URL parameters containing the semester name.
 * @param {string} param0.params.semester - The name of the semester for which courses are to be fetched.
 * @returns {Promise<Object>} A promise that resolves to an object containing the fetched courses.
 * @throws {Error} If there is an error fetching the courses.
 */
export const load = async ({ params }) => {
	try {
		const { semester } = params; // Get the `semester` value from the URL
		const courses = await getCourses(semester);

		return {
			courses
		};
	} catch (err) {
		throw err;
	}
};
