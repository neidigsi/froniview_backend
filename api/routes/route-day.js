/*
* All Request to the route "/category" will be forwarded in this module
 */

// Import node_modules
const express = require('express')
const Sequelize = require('sequelize')

// Import own_modules
const Fronius = require('../models/fronius')
const error = require('../config/error')

// Initialize modules
const router = express.Router()
const Op = Sequelize.Op

/*
* Forward requests to the respective
*
* Allowed are only GET-Requests, because all categories will be defined by the App-Team itself and not
* the users. To add a space to a category the user needs to edit the foreign key "categoryId" of the space
* and not an entry of category.
 */
router.get('/', function (req, res, next) {
    let month = req.query.month
    if (req.query.month < 10) {
        month = '0' + month
    }
    let regex = req.query.year + '-' + month + '-' + req.query.day + '%'

    Fronius.findAll({
        where: {
            timestamp: {
                [Op.like]: regex
            }
        }
    })
        .then(fronius => {
            return res.status(200).json({
                values: fronius
            })
        })
        .catch(err => {
            error.data.throwError(err, res)
        })
})

module.exports = router;
