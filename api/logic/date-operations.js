// Import node_modules
const express = require('express')

// Initialize return variable
let methods = {}

methods.dayIsEqual = function (dateOne, dateTwo) {
    if (dateOne.getFullYear() === dateTwo.getFullYear()
        && dateOne.getMonth() === dateTwo.getMonth()
        && dateOne.getDate() === dateTwo.getDate()) {
        return true
    } else {
        return false
    }
}

methods.monthIsEqual = function (dateOne, dateTwo) {
    if (dateOne.getFullYear() === dateTwo.getFullYear()
        && dateOne.getMonth() === dateTwo.getMonth()) {
        return true
    } else {
        return false
    }
}

exports.data = methods
