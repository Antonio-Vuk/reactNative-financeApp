const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "rootroot",
    database: "finance",
});

module.exports = pool.promise();
