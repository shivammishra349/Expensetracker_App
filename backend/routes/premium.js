let express = require('express');

let route = express.Router()

let preController =require('../controller/premium')

const Userauth = require('../middleware/auth')

route.get('/getpremium', Userauth.authenticate , preController.purchasePremium)

route.post('/updatetransaction' , Userauth.authenticate , preController.UpdateTransactionStatus)

module.exports = route

