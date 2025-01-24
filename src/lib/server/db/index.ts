import { DB_PATH } from '$env/static/private';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(DB_PATH);

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

