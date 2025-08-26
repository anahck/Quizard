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
}

module.exports = Question