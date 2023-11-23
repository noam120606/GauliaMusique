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
        console.log("[Data] Base de Données connectée")
    })

    setInterval(() => {
        db.query("SELECT 1;")
        console.log("[Data] Base de Données rafraichit")
    }, 21600000)

    return db
    
}