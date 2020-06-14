const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./documentation/reference/arp-api.v1.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(morgan(('dev')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

module.exports = app
