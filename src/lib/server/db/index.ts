import { DB_PATH } from '$env/static/private';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(DB_PATH);

//Get a list of the semesters from the db
export function getSemesters() {
	const sql = 'SELECT * FROM semesters';
	return new Promise((resolve, reject) => {
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

//Get a list of the courses for a specific semester from the db
export function getCourses(semester: string) {
	const sql = `
        SELECT * 
        FROM courses 
        WHERE semester_id = (SELECT id FROM semesters WHERE name = ?)
    `;
	return new Promise((resolve, reject) => {
		db.all(sql, [semester], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

//Get a list of the notes for a specific course from the db
export function getNotes(course: string) {
	const sql = `
        SELECT * 
        FROM notes 
        WHERE course_id = (SELECT id FROM courses WHERE name = ?)
    `;
	return new Promise((resolve, reject) => {
		db.all(sql, [course], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

//Get one note
export function getNote(note_name: string) {
	const sql = `
    SELECT * 
    FROM notes 
    WHERE name = ?
    `;
	return new Promise((resolve, reject) => {
		db.get(sql, [note_name], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
}

// Admin User Authentication
export function getAdminUser(username: string) {
	const sql = 'SELECT * FROM admins WHERE username = ?';
	return new Promise<any>((resolve, reject) => {
		db.get(sql, [username], (err, row) => {
			if (err) reject(err);
			resolve(row);
		});
	});
}

function getCoursesIdFromName(course_name: string): Promise<number | null> {
	const sql = 'SELECT id FROM courses WHERE name = ?';
	return new Promise<number | null>((resolve, reject) => {
		db.get(sql, [course_name], (err, row) => {
			if (err) reject(err);
			resolve(row ? row.id : null);
		});
	});
}

export async function insertNewNotes(course_name: string, name: string, file_path: string) {
	try {
		const course_id = await getCoursesIdFromName(course_name);

		if (course_id === null) {
			throw new Error(`Course with name "${course_name}" not found.`);
		}

		const sql = 'INSERT INTO notes (course_id, file_path, name) VALUES (?, ?, ?)';

		return new Promise<void>((resolve, reject) => {
			db.run(sql, [course_id, file_path, name], function (err) {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	} catch (err) {
		throw err;
	}
}
