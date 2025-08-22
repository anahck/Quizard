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

    // static async getOneByEmail(user) {
    //     const response = await db.query("SELECT * FROM userinfo WHERE email = $1;", [user])
    //     if (response.rows.length !== 1) {
    //         throw Error("Unable to locate user")
    //     }
    //     return new UserInfo(response.rows[0])
    // }

    
}

module.exports = UserInfo