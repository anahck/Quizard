const db = require('../db/connect')

class Question {
    constructor({ questionid, questioncontent, testid, totalscore, answer }) {
        this.questionid = questionid
        this.questioncontent = questioncontent
        this.testid = testid
        this.totalscore = totalscore
        this.answer = answer
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM questions;")
        if (response.rows.length === 0) {
            throw Error("No questions available")
        }
        return response.rows.map(question => new Question(question))
    }

    static async getOneByID(question) {
        const response = await db.query("SELECT * FROM questions WHERE questionid = $1;", [question])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate question")
        }
        return new Question(response.rows[0])
    }

    static async getByTestID(test) {
        const response = await db.query("SELECT * FROM questions WHERE testid = $1;", [test])
        if (response.rows.length === 0) {
            throw Error("No questions available for this test")
        }
        return response.rows.map(question => new Question(question))
    }

    static async create(data){
        const {questioncontent, testid, totalscore, answer} = data
        const existingTest = await db.query("SELECT testid FROM test WHERE testid = $1;", [testid])
        
        if (existingTest.rows.length === 0) {
            throw Error("A test with this ID does not exist")
        }
        const response = await db.query("INSERT INTO questions (questioncontent, testid, totalscore, answer) VALUES ($1, $2, $3, $4) RETURNING *;", [questioncontent, testid, totalscore, answer])
            return new Question(response.rows[0])
    }

    async update(data){
        const { questioncontent, testid, totalscore, answer } = data
        const response = await db.query("UPDATE questions SET questioncontent = COALESCE($1, questioncontent), testid = COALESCE($2, testid), totalscore = COALESCE($3, totalscore), answer = COALESCE($4, answer) WHERE questionid = $5 RETURNING *;", [questioncontent, testid, totalscore, answer, this.questionid])
        if (response.rows.length !== 1) {
            throw Error("Unable to update question")
        }
        return new Question(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM questions WHERE questionid = $1;", [this.questionid])
    }

    // static async getAnswers(){
    //     const response = await db.query("SELECT * FROM questions;")
    //     if (response.rows.length === 0) {
    //         throw Error("No questions available")
    //     }
    //     return response.rows.map(row => row.answer)
    // }

    // static async updateScore(userid, testid, score){
    //     const response = await db.query("UPDATE scores SET score = $1 WHERE userid = $2 and testid = $3 RETURNING *;",
    //   [score, userid, testid]);

    //     if (response.rows.length != 1) {
    //         throw new Error("Unable to update score.")
    //     }

    //     return response.rows[0];
    // }

    static async getAnswersByTestID(testid) {
        const response = await db.query("SELECT questionid, answer, totalscore FROM questions WHERE testid = $1;", [testid])
        if (response.rows.length === 0) {
            throw new Error("No questions available")
        }
        return response.rows.map(row => ({
            questionId: row.questionid,
            answer: row.answer,
            totalScore: row.totalscore
        }))
    }

    static async saveScore({ userid, testid, score }) {
        // Check if a score already exists
        const existingScore = await db.query("SELECT * FROM scores WHERE userid = $1 AND testid = $2", [userid, testid])

        if (existingScore.rows.length === 0) {
            // Insert new score
            const response = await db.query("INSERT INTO scores (userid, testid, score, scoredate) VALUES ($1, $2, $3, $4) RETURNING *;", [userid, testid, score, new Date()])
            return response.rows[0]
        } else {
            // Update existing score
            const response = await db.query("UPDATE scores SET score = $1, scoredate = $2 WHERE userid = $3 AND testid = $4 RETURNING *;", [score, new Date(), userid, testid])
            return response.rows[0]
        }
    }

}

module.exports = Question