require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const { getCars, getMfgs } = require('./dal')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Car Hub.  Max is awesome.')
})

app.get('/cars', function(req, res, next) {
  getCars(function(err, cars) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }

    res.status(200).send(cars)
  })
})

app.get('/mfgs', function(req, res, next) {
  getMfgs(function(err, mfgs) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }

    res.status(200).send(mfgs)
  })
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500).send(err)
  next(err)
})

app.use(function(err, req, res, next) {
  console.log('ERROR', JSON.stringify(err))
})

app.listen(port, () => console.log('API is up', port))
