const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");

/**
 * * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 *   1. Validate request
 *   2. Validate idempotency key
 *   3. Check account status
 *   4. Derive sender balance from ledger
 *   5. Create transaction (PENDING)
 *   6. Create DEBIT ledger entry
 *   7. Create CREDIT ledger entry
 *   8. Mark transaction COMPLETED
 *   9. Commit MongoDB session
 *   10. Send email notification
 */





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
        idempotencyKey: idempotencyKey
    })


    if (isTransacrionAlreadyExists) {

        if (isTransacrionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransacrionAlreadyExists
            })
        }


        if (isTransacrionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",

            })
        }


        if (isTransacrionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed previously , please try again."
            })
        }


        if (isTransacrionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed , please retry. "
            })
        }


    }



    //3. check account status 


    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both FromAccount or ToAccount must be Active for transaction."
        })
    }


    //4.Derive sender balance from ledger

    





}