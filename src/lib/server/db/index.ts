import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

/**
 * Creates a Supabase client instance.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches a list of semesters from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of semesters.
 * @throws {Error} If there is an error fetching the semesters.
 */
export async function getSemesters() {
	const { data, error } = await supabase.from('semesters').select('*');
	if (error) {
		throw new Error(error.message);
	}
	return data;
}

/**
 * Fetches a list of courses for a specific semester from the database.
 * @param {string} semester - The name of the semester.
 * @returns {Promise<Array>} A promise that resolves to an array of courses.
 * @throws {Error} If there is an error fetching the courses.
 */
export async function getCourses(semester) {
	const { data, error } = await supabase
		.from('courses')
		.select('*')
		.eq('semester_id', await getSemesterIdFromName(semester));
	if (error) {
		throw new Error(error.message);
	}
	return data;
}

/**
 * Fetches a list of notes for a specific course from the database.
 * @param {string} course - The name of the course.
 * @returns {Promise<Array>} A promise that resolves to an array of notes.
 * @throws {Error} If there is an error fetching the notes.
 */
export async function getNotes(course) {
	const { data, error } = await supabase
		.from('notes')
		.select('*')
		.eq('course_id', await getCoursesIdFromName(course));
	if (error) {
		throw new Error(error.message);
	}
	return data;
}

/**
 * Fetches a single note by its name from the database.
 * @param {string} note_name - The name of the note.
 * @returns {Promise<Object>} A promise that resolves to the note object.
 * @throws {Error} If there is an error fetching the note.
 */
export async function getNote(note_name) {
	const { data, error } = await supabase.from('notes').select('*').eq('name', note_name).single();
	if (error) {
		throw new Error(error.message);
	}
	return data;
}

/**
 * Fetches the course ID for a given course name.
 * @param {string} course_name - The name of the course.
 * @returns {Promise<number|null>} A promise that resolves to the course ID or null if not found.
 * @throws {Error} If there is an error fetching the course ID.
 */
async function getCoursesIdFromName(course_name) {
	const { data, error } = await supabase
		.from('courses')
		.select('id')
		.eq('name', course_name)
		.single();
	if (error) {
		throw new Error(error.message);
	}
	return data ? data.id : null;
}

/**
 * Inserts new notes into the database.
 * @param {string} course_name - The name of the course.
 * @param {string} name - The name of the note.
 * @param {string} file_path - The file path of the note.
 * @throws {Error} If there is an error inserting the notes.
 */
export async function insertNewNotes(course_name, name, file_path) {
	try {
		const course_id = await getCoursesIdFromName(course_name);
		if (course_id === null) {
			throw new Error(`Course with name "${course_name}" not found.`);
		}

		const { error } = await supabase.from('notes').insert([{ course_id, file_path, name }]);
		if (error) {
			throw new Error(error.message);
		}
	} catch (err) {
		throw err;
	}
}

/**
 * Fetches the semester ID for a given semester name.
 * @param {string} semester_name - The name of the semester.
 * @returns {Promise<number|null>} A promise that resolves to the semester ID or null if not found.
 * @throws {Error} If there is an error fetching the semester ID.
 */
async function getSemesterIdFromName(semester_name) {
	const { data, error } = await supabase
		.from('semesters')
		.select('id')
		.eq('name', semester_name)
		.single();
	if (error) {
		throw new Error(error.message);
	}
	return data ? data.id : null;
}

/**
 * Fetches all semesters with their associated courses.
 * @returns {Promise<Array>} A promise that resolves to an array of semesters with their courses.
 */
export async function getSemestersWithCourses() {
	const semesters = await getSemesters();
	const semestersWithCourses = await Promise.all(
		semesters.map(async (semester) => {
			const courses = await getCourses(semester.name);
			return { ...semester, courses };
		})
	);
	return semestersWithCourses;
}
