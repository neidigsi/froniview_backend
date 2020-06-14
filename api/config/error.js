/*
* This module defines methods which handle the file system for images like thumbnails or profile pictures and the ar-objects.
* There are methods for creating the required folders and filters for the file upload with "multer"
 */

// Import node_modules
const express = require('express')

// Initialize return variable
var methods = {}

methods.throwError = function (err, res) {
    console.log(err)
    return res.status(500).json({
        error: err
    })
}

exports.data = methods