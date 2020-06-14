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
 */
router.get('/:year', async function (req, res, next) {
    /*
    * Return an error 400 if the given date is not valid
     */
    if (req.params.year < 1900 || req.params.year > 2100) {
        return res.status(400).json({
            message: "Given date is not valid!",
            year: req.params.year
        })
    }

    let values = []
    let sum_of_values = 0

    for (let i = 1; i <= 12; i++) {
        let monthValue = await getMonthValue(req.params.year, i, res)
        if (monthValue >= 0) {
            sum_of_values += monthValue
            values.push({
                timestamp: req.params.year + '-' + i,
                value: monthValue,
                sum_of_values: sum_of_values
            })
        } else {
            continue
        }
    }

    /*
    * Return an the data successfully
     */
    return res.status(200).json({
        values: values,
        //total: values[values.length - 1].sum_of_values
    })
})

const getMonthValue = async function (year, month, res, cb) {
    return new Promise((resolve, reject) => {
        if (month < 10) {
            month = '0' + month
        }
        let regex = year + '-' + month + '%'

        console.log(regex)

        Fronius.findAll({
            where: {
                timestamp: {
                    [Op.like]: regex
                }
            }
        })
            .then(fronius => {
                if (fronius.length > 0) {
                    let sum = 0
                    let tmp_day = 1
                    for (let i = 0; i < fronius.length; i++) {
                        if (fronius[i + 1] === undefined ||
                            String(fronius[i + 1].dataValues.timestamp).match('/' + year + '-' + month + '-' + tmp_day + '-(.*)/g') === false) {
                            sum += fronius[i].dataValues.day_energy
                            tmp_day++
                        }
                    }

                    console.log(sum)

                    /*
                    * Return the highest sum-value of the day
                     */
                    resolve(sum)
                } else {
                    resolve(-1)
                }
            })
            .catch(err => {
                error.data.throwError(err, res)
            })
    })
}

router.get('/', function (req, res, next) {
    return res.status(200).json({
        message: "General route"
    })
})

module.exports = router;
