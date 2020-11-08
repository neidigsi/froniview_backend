/*
* All POST-Request to the route "/user/login" will be handled in this module.
*
* The user should receive a token to sign his requests.
 */

// Import node_modules
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

// Import own_modules
const User = require('../models/user')
const dboperations = require('../config/database/db-operations')
const error = require('../config/error')

// Initialize modules
const router = express.Router()

/*
* This method handles a POST-Request to "/user/login".
* It will return a JSON Web Token in case of a successful auth. The user is able to sign his requests
* with this token for one hour.
*
* Input:
*     req.body.mail             = The mail of the user to sign in
*     req.body.password         = The password of the user to sign in
* Output:
*     returns 200               = and the bearer token if the auth was successful
*     returns 401               = if the auth fails
*     returns 500               = in error case
 */
router.post('/login', (req, res, next) => {
    let mail = req.body.mail
    let password = req.body.password

    if (mail == undefined) {
        mail = req.query.mail
    }
    if (password == undefined) {
        password = req.query.password
    }
    User.findAll({
        where: {
            mail: mail
        }
    })
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed!'
                })
            }

            // validate if the given password fits to password stored in the db
            bcrypt.compare(password, user[0].password, function (err, result) {

                // in case the password are same generate and return a JWT
                if (result) {
                    const token = jwt.sign(
                        {
                            mail: user[0].mail,     // add the user mail to the token
                            id: user[0].id          // add the user id to the token
                        },
                        process.env.JWT_KEY,      // sign the token with the JWT_KEY of ..env-file
                        {
                            expiresIn: '1h'         // set an duration time of 1 hour
                        })
                    return res.status(200).json({
                        message: 'Auth successful!',
                        id: user[0].id,
                        token: token,
                    })
                }
                console.log(result)
                return res.status(401).json({
                    message: 'Auth failed!'
                })
            })
        })
        .catch(err => {
            error.data.throwError(err, res)
        })
})


/*
* This method handles a POST-Request to "/user/signup".
*
* A signup request is valid without any token!
*
* The method will validate the given mail, that means if it is a valid mail-address and if a user with this mail already exists.
* In both cases a error 409 will be returned!
*
* Input:
*     req.body.name             = the first name of the user
*     req.body.mail             = the mail of the user
*     req.body.password         = the password of the user
* Output:
*     returns 201               = the user was successfully created
*     returns 409               = if the mail is invalid or a user with the mail already exists
*     returns 500               = in error case
 */
/*router.post('/signup', (req, res, next) => {
    User.findAll({
        where: {
            mail: req.body.mail
        }
    })
        .then(users => {

            // validate if a user with given mail already exists and if the given mail is a valid mail-address
            if (users.length >= 1 || !req.body.mail.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
                return res.status(409).json({
                    message: 'Signup failed!'
                })
            } else {

                // Only the hash of the password will be stored in the db.
                // We add a "salt" of 10 to the password, that means 10 random chars, so that there cannot be any conclusions from hash to password.

                // The bcrypt.hash method returns the hash in success case and an err in error case.
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        //create the new user with the data specified in the request
                        var user = new User({
                            id: dboperations.data.generateId('user'),
                            mail: req.body.mail,
                            password: hash,
                            name: req.body.name
                        })

                        // save the user in db
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                return res.status(201).json({
                                    message: 'User created!',
                                    id: user.id
                                })
                            })
                            .catch(err => {
                                error.data.throwError(err, res)
                            })
                    }
                })
            }
        })
        .catch(err => {
            error.data.throwError(err, res)
        })
})*/


module.exports = router
