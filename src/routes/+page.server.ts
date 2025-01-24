import { getSemesters } from '$lib/server/db';

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
