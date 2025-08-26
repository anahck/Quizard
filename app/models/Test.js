const db = require('../db/connect')

class Test {
    constructor({ testid, testname, subjectid, duedate, assigneddate, authorid }) {
        this.testid = testid
        this.testname = testname
        this.subjectid = subjectid
        this.duedate = duedate
        this.assigneddate = assigneddate
        this.authorid = authorid
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM test;")
        if (response.rows.length === 0) {
            throw Error("No tests available")
        }
        return response.rows.map(test => new Test(test))
    }

    static async getOneByID(test) {
        const response = await db.query("SELECT * FROM test WHERE testid = $1;", [test])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate test")
        }
        return new Test(response.rows[0])
    }

    static async create(data){
        const {testname, subjectid, duedate, assigneddate, authorid} = data
        const existingTest = await db.query("SELECT testname FROM test WHERE testname = $1;", [testname])
        const existingSubject = await db.query("SELECT subjectid FROM subjects WHERE subjectID = $1;", [subjectid])
        const existingAuthor = await db.query("SELECT userID FROM userInfo WHERE userID = $1;", [authorid])
        
        if (existingSubject.rows.length === 0) {
            throw Error("A subject with this ID does not exist")
        }
        if (existingAuthor.rows.length === 0) {
            throw Error("An author with this ID does not exist")
        }
        if(existingTest.rows.length === 0){
            const response = await db.query("INSERT INTO test (testname, subjectid, duedate, assigneddate, authorid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [testname, subjectid, duedate, assigneddate, authorid])
            return new Test(response.rows[0])
        }
        else{
            throw Error("A test with this name already exists")
        }
    }
}

module.exports = Test