const db = require('../db/connect')

class Score {
    constructor({ scoreid, userid, testid, score, scoredate, attempt }) {
        this.scoreid = scoreid
        this.userid = userid
        this.testid = testid
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
}

module.exports = Score