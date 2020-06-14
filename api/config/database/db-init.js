/*
* This module initializes the DB connection.
 */

// Import node_modules
const Sequelize = require('sequelize')
const dotenv = require('dotenv').config()

module.exports = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBIP,
    dialect: "mysql",
    port: process.env.DBPORT
})
