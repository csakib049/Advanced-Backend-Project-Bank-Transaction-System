const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");



async function createTransaction(req, res) {


    //1.valid request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body


    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAcccount , toAcccount , Amount and idempotencyKey is required"
        })
    }


    const fromUserAccount = await accountModel.findOne({
        id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        id: toAccount,
    })



    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        })
    }



    //2.Validate idempotency key 

    const isTransacrionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })


    if(isTransacrionAlreadyExists){

        if(isTransacrionAlreadyExists.status ==="COMPLETED"){
            res.status(200).json({
                message:"Transaction already processed",
                transaction: isTransacrionAlreadyExists
            })
        }


        if(isTransacrionAlreadyExists.status==="PENDING"){
            res.status(200).json({
                message:"Transaction is still processing",

            })
        }


        if(isTransacrionAlreadyExists.status === "FAILED"){
            res.status(500).json({
                message:"Transaction processing failed previously , please try again."
            })
        }


        if(isTransacrionAlreadyExists.status ==="REVERSED"){
            res.status(500).json({
                message:"Transaction was reversed , please retry. "
            })
        }


    }



    //

}