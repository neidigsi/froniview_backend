/*
 */

// Import node_modules
const express = require('express')
const crypto = require('crypto')

// Import own_modules
const error = require('../error')

// Initialize return variable
var methods = {}

/*
* This method generates a valid id for the given relation.
*
* Input:
*     relation                  = the name of the relation in which the id should be or a array with two entries, that means two relations
* Output:
*     string                    = the generated id as string
 */
methods.generateId = function (relation) {
    var id = crypto.randomBytes(12).toString('hex')
    while (methods.validateID(relation, id) === false) {
        id = crypto.randomBytes(12).toString('hex')
    }
    return id
}


/*
* This method validates a given id.
* That means it checks if a entry with given id already exists.
*
* Input:
*     id                        = The id to validate
*     relation                  = the name of the relation in which the id should be or a array with two entries, that means two relations
* Output:
*     true                      = if the given id is valid, that means does not exist
*     false                     = if the given id is invalid, that means already exits
 */
methods.validateID = function (relation, id) {
    if (typeof relation === 'string') {
        const Relation = require('../../models/' + relation)
        Relation.findAll({
            where: {
                id: id
            }
        })
            .then(results => {
                if (results.length >= 1) {
                    return false
                } else {
                    return true
                }
            })
            .catch(err => {
                error.data.throwError(err)
            })
    } else {
        const RelationOne = require('../../models/' + relation[0])
        const RelationTwo = require('../../models/' + relation[1])
        RelationOne.findAll({
            where: {
                id: id
            }
        })
            .then(results => {
                if (results.length >= 1) {
                    return false
                } else {
                    RelationTwo.findAll({
                        where: {
                            id: id
                        }
                    })
                        .then(results => {
                            if (results.length >= 1) {
                                return false
                            } else {
                                return true
                            }
                        })
                        .catch(err => {
                            error.data.throwError(err)
                        })
                }
            })
            .catch(err => {
                error.data.throwError(err)
            })

    }
}

exports.data = methods