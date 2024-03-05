const mysql = require('mysql');

const connection = function () {   
const pool = mysql.createPool({
    connectionLimit: 10,
    host:  "localhost",
    user:  "root",
    password:"Manav@10503",
    database:"toConnect",
})
return pool;
}
const dbcon = connection();
module.exports= dbcon;