import { getCourses, getSemesters } from '$lib/server/db';

/**
 * Fetches all semesters with their associated courses.
 * @returns {Promise<Array>} A promise that resolves to an array of semesters with their courses.
 */
async function getSemestersWithCourses() {
	const semesters = await getSemesters();
	const semestersWithCourses = await Promise.all(
		semesters.map(async (semester) => {
			const courses = await getCourses(semester.name);
			return { ...semester, courses };
		})
	);
	return semestersWithCourses;
}

/**
 * Handles GET requests to fetch semesters with courses.
 * @param {Object} param0 - The request object.
 * @param {Request} param0.request - The HTTP request object.
 * @returns {Promise<Response>} A promise that resolves to an HTTP response with semesters and courses data or an error message.
 */
export async function GET({ request }) {
	try {
		const semestersWithCourses = await getSemestersWithCourses();
		return new Response(JSON.stringify(semestersWithCourses), {
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
