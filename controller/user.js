const User = require('../model/user')
const Wallet = require('../model/wallet')
const WalletHistory = require('../model/WalletHistory')
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
var path = require('path');
const fs = require('fs');

const ExcelJS = require('exceljs');

const javascriptBarcodeReader = require('javascript-barcode-reader');


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
        console.log("Log 1: ",new Date(),req.query.requestId)

        let amount = 0;

        let WalletBalance = await Wallet.findOneAndUpdate({userId:req.query.userId},{consistent:true});
        if(req.query.amountFor == 0){
            amount = WalletBalance ? Number(WalletBalance.amount - req.query.amount) : Number(0 - req.query.amount)
        }else{
            amount = WalletBalance ? Number(parseInt(WalletBalance.amount) + parseInt(req.query.amount)) : Number(req.query.amount)
        }

        // if(!WalletBalance.consistent){
            if(WalletBalance){
                await Wallet.updateOne({userId:req.query.userId},{amount:amount,updatedAt:new Date(),consistent:false})
                await WalletHistory({
                    userId: req.query.userId,
                    amount:Number(req.query.amount)
                }).save();
                res.json({sucess:'Balance Updated!'})
            }else{
                await Wallet({
                    userId:req.query.userId,
                    amount:Number(req.query.amount)
                }).save();
                res.json({sucess:'Balance Updated!'})
            }
        // }else{
        //     res.json({sucess:'Wallet not consistent!'})
        // }

    }catch(e){
        console.log(e);
        res.json({error:'Something wrong!'})
    }
}




exports.extractXls = async function(req,res){
    try{
        req.setTimeout(900000);
        
        const workbook = new ExcelJS.Workbook();
        const data = await workbook.xlsx.readFile(`${__dirname}/audit_w_barcodes.xlsx`);

        let listJson = [];

        const worksheet = workbook.worksheets[0];

            let jsonData = await Promise.all(worksheet.getImages().map(async(image) =>{

            const img = workbook.model.media.find(m => m.index === image.imageId);
            fs.writeFileSync(`${img.name}.${img.extension}`, img.buffer)

            let imagePath = `${img.name}.${img.extension}`;
            await javascriptBarcodeReader({
                image: imagePath,
                barcode: 'code-128',
                options: {}
            })
            .then(code => {
                console.log(code,worksheet.getRow(Number(parseInt(image.range.tl.nativeRow) + 3)).getCell(1).toString())
                listJson.push({
                    qty:worksheet.getRow(Number(image.range.tl.nativeRow +3)).getCell(1).toString(),
                    code: code
                })

                // fs.unlink(imagePath,function(err){
                //     if(err) return console.log(err);
                //     console.log('file deleted successfully');
                // });
            })
            .catch(err => {
                console.log(err)
            })

            return listJson;

        }));

        console.log(JSON.stringify(listJson))
        res.json({data:listJson})
    }catch(e){
        console.log(e);
        res.json({error:'Something wrong!'})
    }

}


exports.upload = async function(req,res){
    try{

        console.log(req.body,req.file)
        res.json({data:req.body})
    }catch(e){
        console.log(e)
    }
}