const User = require('../model/user')
const Wallet = require('../model/wallet')
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

exports.addUsers = async function(req,res){
    try{

        let usersData = [];

        for (let index = 0; index < 10000009; index++) {
        //    await usersData.push({
        //         fullName:makeid(5),
        //         phone:Math.floor((Math.random() * 10000000000) + 1000000000),
        //         email:makeid(5) +Math.floor((Math.random() * 1000) + 10) + '@gmail.com'
        //     });

            await User({
                fullName:makeid(5),
                phone:Math.floor((Math.random() * 10000000000) + 1000000000),
                email:makeid(5) +Math.floor((Math.random() * 1000) + 10) + '@gmail.com'
            }).save();
            console.log(":updated Date: ",new Date())
        }

        // console.log(JSON.stringify(usersData))

        // let userAdd = await User(usersData).save();

        // if(userAdd){
            res.json({sucess:'User added successfully!'})
        // }else{
        //     res.json({error:'Something wrong, Please try again!'})
        // }

    }catch(e){
        console.log(e);
        res.json({error:'Something wrong!'})
    }
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

exports.getUsers = async function(req,res){
    try{

        let userAdd = await User.find({email:req.query.val})

        if(userAdd){
            res.json({sucess:'User fetched!',data:userAdd})
        }else{
            res.json({error:'Something wrong, Please try again!',data:null})
        }

    }catch(e){
        console.log(e);
        res.json({error:'Something wrong!'})
    }
}

//Update Wallet Balance
exports.updateWalletBalance = async function(req,res){
    try{

        let amount = 0;

        let WalletBalance = await Wallet.findOne({userId:req.query.userId});

        if(req.query.amountFor == 0){
            amount = WalletBalance ? Number(WalletBalance.amount - req.query.amount) : Number(0 - req.query.amount)
        }else{
            amount = WalletBalance ? Number(parseInt(WalletBalance.amount) + parseInt(req.query.amount)) : Number(req.query.amount)
        }

        if(WalletBalance){
            await Wallet.updateOne({userId:req.query.userId},{amount:amount})
            res.json({sucess:'Balance Updated!'})
        }else{
            await Wallet({
                userId:req.query.userId,
                amount:amount
            }).save();
            res.json({sucess:'Balance Updated!'})
        }

    }catch(e){
        console.log(e);
        res.json({error:'Something wrong!'})
    }
}