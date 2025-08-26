const db = require('../db/connect')

class UserInfo {
    constructor({ userid, firstname, lastname, email, passwordhash, userrole, yeargroup }) {
        this.userid = userid
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.passwordhash = passwordhash
        this.userrole = userrole
        this.yeargroup = yeargroup
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM userinfo;")
        if (response.rows.length === 0) {
            throw Error("No users available")
        }
        return response.rows.map(user => new UserInfo(user))
    }

    static async getOneByID(user) {
        const response = await db.query("SELECT * FROM userinfo WHERE userid = $1;", [user])
        if (response.rows.length !== 1) {
            throw Error("Unable to locate user")
        }
        return new UserInfo(response.rows[0])
    }

    static async create(data){
        const {firstname, lastname, email, passwordhash, userrole, yeargroup} = data
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

    async update(data){
        const updatable = ["firstname", "lastname", "email", "passwordhash", "userrole", "yeargroup"]
        const fields = Object.keys(data).map(field => field.toLowerCase()).filter(field => updatable.includes(field))
        if (fields.length === 0) {
            throw Error("No valid fields to update")
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")
        const values = fields.map(field => data[field])
        values.push(this.userid)

        const response = await db.query(`UPDATE userinfo SET ${setClause} WHERE userid = $${values.length} RETURNING *;`, values)
        if (response.rows.length !== 1) {
            throw Error("Unable to update user")
        }
        return new UserInfo(response.rows[0]) 
    }

    async destroy() {
        const response = await db.query("DELETE FROM userinfo WHERE userid = $1;", [this.userid])
    }

    // static async getOneByEmail(user) {
    //     const response = await db.query("SELECT * FROM userinfo WHERE email = $1;", [user])
    //     if (response.rows.length !== 1) {
    //         throw Error("Unable to locate user")
    //     }
    //     return new UserInfo(response.rows[0])
    // }

    
}

module.exports = UserInfo