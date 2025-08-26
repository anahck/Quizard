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
}

module.exports = Test