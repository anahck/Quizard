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
        const existingUser = await db.query("SELECT email FROM userinfo WHERE email = $1", [email])
        if(existingUser.rows.length === 0){
            const response = await db.query("INSERT INTO userinfo (firstname, lastname, email, passwordhash, userrole, yeargroup) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [firstname, lastname, email, passwordhash, userrole, yeargroup]);
            return new UserInfo(response.rows[0])
        }
        else{
            throw new Error("A user with this email already exists")
        }
    }
}

module.exports = Test