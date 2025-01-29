// GET: Fetch semesters with courses

import { getCourses, getSemesters } from '$lib/server/db';

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
