const sequelize = require('../database/connection');
let Expense = require('../model/expense')
let User = require('../model/user')
const AWS = require('aws-sdk')
const S3services = require('../services/S3services')
let Url = require('../model/url')

const getExpense =async(req,res,next)=>{
    try{

        const page = req.query.page || 1;
        const limit = parseInt(req.query.limit) ||5 ;
        console.log(limit)
        const offset = (page-1) * limit
        
        const data= await Expense.findAll({where : {userId: req.user.id},
            limit:limit,
            offset:offset
        });
        res.status(200).json({details:data})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:'internal server error'})
    }
}

const addExpense =async (req,res,next)=>{

    const t= await sequelize.transaction()

    try{
    let amount= req.body.amount;
    let description = req.body.description;
    let catagory = req.body.catagory;
    let userId= req.user.id
    
    // console.log(des)

    if(amount ==undefined || amount.length ===0){
        return res.status(400).json({success:false , message :'parameter missing'})
    }

   let response = await  Expense.create({amount , description , catagory , userId},{transaction:t})

        // console.log('Existing Total_cost:', req.user.Total_cost);

        const total_expense= Number(req.user.Total_cost) + Number(amount);

       await User.update({
            Total_cost : total_expense,
            
        }, {
            where:{id : userId},
            transaction:t
        })
         await t.commit()
        res.status(200).json({expense:response})
    
    }
    catch(err){
        await t.rollback()
        res.status(500).json({success:false , error:err})
    }
}



const deleteExpense =async (req,res,next)=>{

    try{
        
        if(!req.params.id){
            console.log('id not found')
            return res.status(400).json({message:'id is missing'})
        }
        let id = req.params.id;
    

        const expense = await Expense.findByPk(id)
        const amount = expense.amount;



        await Expense.destroy({where: {id : id}})

        let user = await User.findByPk(expense.userId)
        const updateCost = Number(user.Total_cost) - Number(amount)

        await user.update({ Total_cost: updateCost });

    // await t.commit()
    res.status(200).json({message:'Data deleted succes'})
    }
    catch(err){
        // await t.rollback()
        res.status(500).json({message:'Somthing went wrong in deletetion'})
    }
}


const downlodeExpense = async (req,res)=>{
    try{
        const expenses= await Expense.findAll({where : {userId: req.user.id}});
    console.log(expenses)
    

    const userid = req.user.id
    const stringifiedExpense = JSON.stringify(expenses)
    const filename = `Expense${userid}/${new Date()}.txt`;
    const fileURL = await S3services.uploadToS3(stringifiedExpense , filename);
    console.log(fileURL)
    await Url.create({url:fileURL,userId: req.user.id})



    
    res.status(200).json({fileURL , success:true})
    }
    catch(err){
        console.log(err)
        res.status(500).json({fileURL:'' , success:false,err:err})
    }
    
}
let getUrl =async (req,res)=>{
    try{
         const data= await Url.findAll({where : {userId: req.user.id}});
        res.status(200).json({response:data})
    }
    catch(err){
        res.status(500).json({message:'internal server error'})
    }
    
}

module.exports ={
    getExpense,
    addExpense,
    deleteExpense,
    downlodeExpense,
    getUrl
}