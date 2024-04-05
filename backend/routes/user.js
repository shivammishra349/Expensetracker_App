let express=require('express')

let router=express.Router();

let Controller = require('../controller/user')

router.post('/signup',Controller.postSignup)

router.post('/login',Controller.postLogin)

module.exports = router