let User = require('../model/user.js')

let jwt = require('jsonwebtoken')
require('dotenv').config()

let secretKey = process.env.JWT_SECRET_KEY

exports.authenticate = (req,res,next)=>{
    try{
        const token =  req.header('Authorization');
        console.log(token);

        let user = jwt.verify(token,secretKey)
        console.log(user.userId);

        User.findByPk(user.userId).then((user)=>{
            req.user = user
            next()
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({success:'false'})
    }
}

// module.exports = authenticate