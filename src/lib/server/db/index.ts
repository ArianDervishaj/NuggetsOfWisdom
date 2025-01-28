import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
// Get a list of the semesters from the db
export async function getSemesters() {
    const { data, error } = await supabase.from('semesters').select('*');
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get a list of the courses for a specific semester from the db
export async function getCourses(semester) {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('semester_id', (await getSemesterIdFromName(semester)));
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get a list of the notes for a specific course from the db
export async function getNotes(course) {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('course_id', (await getCoursesIdFromName(course)));
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get one note
export async function getNote(note_name) {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('name', note_name)
        .single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Admin User Authentication
export async function getAdminUser(username) {
    const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

// Get course ID from name
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

// Insert new notes
export async function insertNewNotes(course_name, name, file_path) {
    try {
        const course_id = await getCoursesIdFromName(course_name);
        if (course_id === null) {
            throw new Error(`Course with name "${course_name}" not found.`);
        }

        const { error } = await supabase
            .from('notes')
            .insert([{ course_id, file_path, name }]);
        if (error) {
            throw new Error(error.message);
        }
    } catch (err) {
        throw err;
    }
}

// Get semester ID from name (similar to the getCoursesIdFromName function)
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
