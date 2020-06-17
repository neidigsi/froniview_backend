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
* Forward requests to the respective
*
* Allowed are only GET-Requests, because all categories will be defined by the App-Team itself and not
* the users. To add a space to a category the user needs to edit the foreign key "categoryId" of the space
* and not an entry of category.
 */
router.get('/', checkAuth, async function (req, res, next) {
    /*
    * Return an error 400 if the given date is not valid
     */
    if ((req.query.year < 1900 || req.query.year > 2100) ||
        (req.query.month < 1 || req.query.month > 12)) {
        return res.status(400).json({
            message: "Given date is not valid!",
            year: req.query.year,
            month: req.query.month
        })
    }

    let values = []
    let sum_of_values = 0

    for (let i = 1; i <= new Date(req.query.year, req.query.month, 0).getDate(); i++) {
        let dayValue = await getDayValue(req.query.year, req.query.month, i, res)
        if (dayValue >= 0) {
            sum_of_values += dayValue
            values.push({
                timestamp: req.query.year + '-' + req.query.month + '-' + i,
                value: dayValue,
                sum_of_values: sum_of_values
            })
        } else {
            break
        }
    }

    /*
    * Return an the data successfully
     */
    return res.status(200).json({
        values: values,
        total: values[values.length - 1].sum_of_values
    })
})

const getDayValue = async function (year, month, day, res, cb) {
    return new Promise((resolve, reject) => {
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        let regex = year + '-' + month + '-' + day + '%'

        Fronius.findAll({
            where: {
                timestamp: {
                    [Op.like]: regex
                }
            }
        })
            .then(fronius => {
                if (fronius.length > 0) {
                    /*
                    * Return the highest sum-value of the day
                     */
                    resolve(fronius[fronius.length - 1].dataValues.day_energy)
                } else {
                    resolve(-1)
                }
            })
            .catch(err => {
                error.data.throwError(err, res)
            })
    })
}


module.exports = router;
