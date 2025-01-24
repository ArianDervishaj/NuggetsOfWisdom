import { getNotes } from '$lib/server/db';

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
