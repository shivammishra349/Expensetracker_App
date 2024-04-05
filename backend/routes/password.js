let express = require('express');

let route = express.Router();

let passwordController = require('../controller/password')

route.get('/updatepassword/:resetpasswordid', passwordController.updatePassword)

route.get('/resetpassword/:id',passwordController.resetPassword)

route.post('/forgetpassword',passwordController.forgetPassword)

module.exports = route
