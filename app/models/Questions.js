const db = require('../db/connect')

class Questions {
    constructor({ questionid, questioncontent, testid, totalscore, answer }) {
        this.questionid = questionid
        this.questioncontent = questioncontent
        this.testid = testid
        this.totalscore = totalscore
        this.answer = answer
    }


    static async getAnswers(){
        const response = await db.query("SELECT * FROM questions;")
        if (response.rows.length === 0) {
            throw Error("No questions available")
        }
        return response.rows.map(row => row.answer)
    }

    static async updateScore(userid, testid, score){
        const response = await db.query("UPDATE scores SET score = $1 WHERE userid = $2 and testid = $3 RETURNING *;",
      [score, userid, testid]);

        if (response.rows.length != 1) {
            throw new Error("Unable to update score.")
        }

        return response.rows[0];
    }
}

module.exports = Questions