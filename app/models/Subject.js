const db = require('../db/connect')

class Subject {
    constructor({ subjectid, subjectname }) {
        this.subjectid = subjectid
        this.subjectname = subjectname
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM subjects;")
        if (response.rows.length === 0) {
            throw Error("No subjects available")
        }
        return response.rows.map(subject => new Subject(subject))
    }

    static async getOneByID(subject) {
        const response = await db.query("SELECT * FROM subjects WHERE subjectid = $1;", [subject])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate subject")
        }
        return new Subject(response.rows[0])
    }

    static async create(data){
        const {subjectname} = data
        const existingSubject = await db.query("SELECT subjectname FROM subjects WHERE subjectname = $1;", [subjectname])
        if(existingSubject.rows.length === 0){
            const response = await db.query("INSERT INTO subjects (subjectname) VALUES ($1) RETURNING *;", [subjectname])
            return new Subject(response.rows[0])
        }
        else{
            throw new Error("A subject with this name already exists")
        }
    }

    async update(data) {
        const response = await db.query("UPDATE subjects SET subjectname = $1 WHERE subjectid = $2 RETURNING subjectid, subjectname;", [data.subjectname, this.subjectid])
        if (response.rows.length !== 1) {
            throw Error("Unable to update subject")
        }
        return new Subject(response.rows[0])
    }

    async destroy() {
        const response = await db.query("DELETE FROM subjects WHERE subjectid = $1;", [this.subjectid])
    }
}

module.exports = Subject