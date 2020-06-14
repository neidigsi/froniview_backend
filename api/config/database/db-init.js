/*
* This module initializes the DB connection.
 */

// Import node_modules
const Sequelize = require('sequelize')
const dotenv = require('dotenv').config()

module.exports = new Sequelize('mysql://' +
    process.env.DBUSER +
    ':' +
    process.env.DBPASSWORD +
    '@' +
    process.env.DBIP +
    ':' +
    process.env.DBPORT +
    '/' +
    process.env.DBNAME)
