const db = require('../db/connect')

class Score {
    constructor({ scoreid, userid, testid, score, scoredate, attempt, classid }) {
        this.scoreid = scoreid
        this.userid = userid
        this.testid = testid
        this.classid = classid
        this.score = score
        this.scoredate = scoredate
        this.attempt = attempt
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM scores;")
        if (response.rows.length === 0) {
            throw Error("No scores available")
        }
        return response.rows.map(score => new Score(score))
    }

    static async getOneByScoreID(score) {
        const response = await db.query("SELECT * FROM scores WHERE scoreid = $1;", [score])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate score")
        }
        return new Score(response.rows[0])
    }

    static async getByUserID(user) {
        const response = await db.query("SELECT * FROM scores WHERE userid = $1;", [user])
        if (response.rows.length === 0) {
            throw Error("No scores available for this user")
        }
        return response.rows.map(score => new Score(score))
    }

    static async getByTeacherID(teacherID) {
        const classRes = await db.query(
            `SELECT classid FROM class_members WHERE userid = $1;`, [teacherID]
        );
        if (classRes.rows.length === 0) {
            throw Error("No classes found for this teacher")
        }
        const classIDs = classRes.rows.map(row => row.classid);
        const response = await db.query(
            `SELECT s.score, s.userid, u.firstname, u.lastname, t.testname, s.classid
             FROM scores s
             JOIN userinfo u ON s.userid = u.userid
             JOIN test t ON s.testid = t.testid
             WHERE s.classid = ANY($1);`, [classIDs]
        );
        if (response.rows.length === 0) {
            throw Error("No scores available for classes with this teacher")
        }
        return response.rows.map(row => ({
            userid: row.userid,
            name: `${row.firstname} ${row.lastname}`.trim(),
            score: row.score,
            testname: row.testname,
            classid: row.classid
        }));
    }

    static async create(data){
        const {userid, testid, score, scoredate} = data
        const existingUser = await db.query("SELECT userid FROM userinfo WHERE userid = $1;", [userid])
        const existingTest = await db.query("SELECT testid FROM test WHERE testid = $1;", [testid])
        
        if (existingUser.rows.length === 0) {
            throw Error("A user with this ID does not exist")
        }
        if (existingTest.rows.length === 0) {
            throw Error("A test with this ID does not exist")
        }
        const response = await db.query("INSERT INTO scores (userid, testid, score, scoredate) VALUES ($1, $2, $3, $4) RETURNING *;", [userid, testid, score, scoredate])
            return new Score(response.rows[0])
    }

    async update(data){
        const { score, scoredate } = data
        const response = await db.query("UPDATE scores SET score = COALESCE($1, score), scoredate = COALESCE($2, scoredate) WHERE scoreid = $3 RETURNING *;", [score, scoredate, this.scoreid])
        if (response.rows.length !== 1) {
            throw Error("Unable to update score")
        }
        return new Score(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM scores WHERE scoreid = $1;", [this.scoreid])
    }

    static async getWithStudentNamesByClassID(classID) {
        const response = await db.query(
            `SELECT s.score, s.userid, u.firstname, u.lastname
             FROM scores s
             JOIN userinfo u ON s.userid = u.userid
             WHERE s.classid = $1;`, [classID]
        );
        if (response.rows.length === 0) {
            throw Error("No scores available for this class")
        }
        return response.rows.map(row => ({
            userid: row.userid,
            name: `${row.firstname} ${row.lastname}`.trim(),
            score: row.score
        }));
    }
}

module.exports = Score