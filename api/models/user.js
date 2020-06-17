const Sequelize = require('sequelize');
const db =  require('../config/database/db-init');

const user = db.define('user', {
    id: {
        type: Sequelize.STRING(255),
        required: true,
        primaryKey: true
    },
    mail: {
        type: Sequelize.STRING(255),
        required: true
    },
    name: {
        type: Sequelize.STRING(255)
    },
    password: {
        type: Sequelize.STRING(255),
        required: true
    }
}, {
    timestamps: false
});

module.exports = user;
