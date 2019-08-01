const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 100,
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    multipleStatements : true
})

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

// Promisify for Node.js async/await.
const util = require('util');
pool.query = util.promisify(pool.query) // Magic happens here.

// create db
pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => { if (err) console.error('Database creation error ', err) })

// set the db for the rest of the queries
pool.config.connectionConfig.database = process.env.DB_NAME

module.exports = pool
