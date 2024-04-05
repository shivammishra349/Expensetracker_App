let express = require('express');

let featureController = require('../controller/feature.js')

const Userauth = require('../middleware/auth')

let route = express.Router();

route.get('/getfeature', Userauth.authenticate,featureController.getFeatures)

module.exports = route