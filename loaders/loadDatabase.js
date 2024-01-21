const mysql = require('mysql')

module.exports = async (client) => {

    let db = mysql.createConnection({
        host: process.env.DBhost,
        user: process.env.DBuser,
        password: process.env.DBpassword,
        database: process.env.DBdatabase,
        port: '3306'
    })

    db.connect(function(e) {
        if (e) return console.error(e)
    })

    setInterval(() => {
        db.query("SELECT 1;")
    }, 21600000)

    return db
    
}