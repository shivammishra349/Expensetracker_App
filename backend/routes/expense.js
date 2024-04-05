let express = require('express');

let router= express.Router()

let expenseController = require('../controller/expense')

const Userauth = require('../middleware/auth')

router.get('/getexpense', Userauth.authenticate , expenseController.getExpense)

router.post('/addexpense',Userauth.authenticate , expenseController.addExpense)

router.get('/downlode',Userauth.authenticate,expenseController.downlodeExpense)

router.get('/geturl',Userauth.authenticate,expenseController.getUrl)

router.delete('/deleteExpense/:id',Userauth.authenticate,expenseController.deleteExpense)

module.exports = router