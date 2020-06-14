const Sequelize = require('sequelize');
const db =  require('../config/database/db-init');

const fronius = db.define('fronius', {
    timestamp: {
        type: Sequelize.STRING(255),
        required: true,
        primaryKey: true
    },
    day_energy: {
        type: Sequelize.INTEGER
    },
    pac: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false,
});

module.exports = fronius;
