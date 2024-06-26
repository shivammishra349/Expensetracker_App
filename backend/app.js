let express=require('express')

let fs= require('fs')

let path = require('path')

require('dotenv').config()

let sequelize = require('./database/connection')

let user = require('./model/user')

let expense = require('./model/expense')

let order = require('./model/order')

let url = require('./model/url')

let forgetPassword = require('./model/password')

const cors=require('cors');

let app=express();


let userRoute = require('./routes/user')

let expenseRoute =require('./routes/expense')

let purchaseRoute = require('./routes/premium')

let primumRoute = require('./routes/premiumfeatures')

let passwordRoute = require('./routes/password')

app.use(cors());

app.use(express.json())


app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', primumRoute);
app.use('/password', passwordRoute);

app.use((req,res)=>{
    console.log('url', req.url)
    res.sendFile(path.join(__dirname , `public/${req.url}`))
})
user.hasMany(expense)
expense.belongsTo(user)

user.hasMany(order)
order.belongsTo(user)

user.hasMany(forgetPassword)
forgetPassword.belongsTo(user)

user.hasMany(url)
url.belongsTo(user)

sequelize.sync()
    .then(()=>{
        // console.log(process.env.port)
        app.listen(process.env.port)
    })
    .catch((err)=>{
        console.log(err)
    })