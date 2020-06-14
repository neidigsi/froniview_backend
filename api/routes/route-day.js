/*
* All Request to the route "/category" will be forwarded in this module
 */

// Import node_modules
const express = require('express')

// Import own_modules

// Initialize modules
const router = express.Router()

/*
* Forward requests to the respective
*
* Allowed are only GET-Requests, because all categories will be defined by the App-Team itself and not
* the users. To add a space to a category the user needs to edit the foreign key "categoryId" of the space
* and not an entry of category.
 */
router.get('/', function (req, res, next) {
    return res.status(200).json({
        message: "Day route"
    })
})

module.exports = router;
