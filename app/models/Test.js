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

        if (!testname) {
            throw Error("Test name is missing")
        }

        const existingTest = await db.query("SELECT testname FROM test WHERE testname = $1;", [testname])
        
        if(existingTest.rows.length === 0){
            const response = await db.query("INSERT INTO test (testname, subjectid, duedate, assigneddate, authorid) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
                [testname, subjectid, duedate, assigneddate, authorid])
            
            console.log(response.rows[0]);
            return new Test(response.rows[0])
        }
        else {
            throw Error("A test with this name already exists")
        }
    }

    async update(data) {
        const { testname, subjectid, duedate, assigneddate, authorid } = data;
        const response = await db.query("UPDATE test SET testname = COALESCE($1, testname), subjectid  = COALESCE($2, subjectid), duedate    = COALESCE($3, duedate), assigneddate = COALESCE($4, assigneddate), authorid   = COALESCE($5, authorid) WHERE testid = $6 RETURNING *;", [testname, subjectid, duedate, assigneddate, authorid, this.testid])
        if (response.rows.length !== 1) {
            throw new Error("Unable to update test");
        }
        return new Test(response.rows[0]);
    }

    // async update(data){
    //     const updatable = ["testname", "subjectid", "duedate", "authorid"]
    //     const fields = Object.keys(data).map(field => field.toLowerCase()).filter(field => updatable.includes(field))
    //     if (fields.length === 0) {
    //         throw Error("No valid fields to update")
    //     }

    //     const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")
    //     const values = fields.map(field => data[field])
    //     values.push(this.testid)

    //     const response = await db.query(`UPDATE test SET ${setClause} WHERE testid = $${values.length} RETURNING *;`, values)
    //     if (response.rows.length !== 1) {
    //         throw Error("Unable to update test")
    //     }
    //     return new Test(response.rows[0]) 
    // }

    async destroy() {
        const response = await db.query("DELETE FROM test WHERE testid = $1;", [this.testid])
    }
}

module.exports = Test