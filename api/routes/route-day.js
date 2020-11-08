/*
* All Request to the route "/category" will be forwarded in this module
 */

// Import node_modules
const express = require('express')
const Sequelize = require('sequelize')

// Import own_modules
const Fronius = require('../models/fronius')
const error = require('../config/error')
const checkAuth = require('../middleware/check-auth')


// Initialize modules
const router = express.Router()
const Op = Sequelize.Op

/*
* Retrieve requests GET to the path /day
 */
router.get('/', checkAuth, function (req, res, next) {
    let month = req.query.month
    let day = req.query.day
    if (req.query.month < 10) {
        month = '0' + month
    }
    if (req.query.day < 10) {
        day = '0' + day
    }

    let regex = req.query.year + '-' + month + '-' + day + '%'

    /*
    * Return an error 400 if the given date is not valid
     */
    if ((req.query.year < 1900 || req.query.year > 2100) ||
        (req.query.month < 1 || req.query.month > 12) ||
        (req.query.day < 1 || req.query.day > 31)) {
        return res.status(400).json({
            message: "Given date is not valid!",
            year: req.query.year,
            month: req.query.month,
            day: req.query.day
        })
    }

    Fronius.findAll({
        where: {
            timestamp: {
                [Op.like]: regex
            }
        },
        attributes: [
            'timestamp',
            ['pac', 'value'],
            ['day_energy', 'sum_of_values']
        ]
    })
        .then(fronius => {
            /*
            * Return an error 404 if there could no data be found for given date
             */
            if (fronius.length == 0) {
                return res.status(404).json({
                    message: "No data could be found to given date!",
                    year: req.query.year,
                    month: req.query.month,
                    day: req.query.day
                })
            }

            /*
            * Return an the data successfully
             */
            return res.status(200).json({
                values: fronius,
                total: fronius[fronius.length - 1].dataValues.sum_of_values
            })
        })
        .catch(err => {
            error.data.throwError(err, res)
        })
})

module.exports = router;
