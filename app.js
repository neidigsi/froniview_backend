const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const dayRoute = require('./api/routes/route-day')
const monthRoute = require('./api/routes/route-month')
const userRoutes = require('./api/routes/route-user')
const yearRoute = require('./api/routes/route-year')
const swaggerDocument = YAML.load('./documentation/reference/froniview_backend.v1.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(morgan(('dev')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/user', userRoutes)
app.use('/day', dayRoute)
app.use('/month', monthRoute)
app.use('/year', yearRoute)

module.exports = app
