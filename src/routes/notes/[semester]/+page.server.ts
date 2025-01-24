import { getCourses } from '$lib/server/db';

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
