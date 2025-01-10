import { error, success } from "../helpers/response.js";
import asyncWrapper from "../middlewares/async.js";
import user from "../models/user.js";
import User from "../models/user.js";
import { banks, verifyAccount, createRecipient, payout, payWithCard, verifyPaystackTransaction } from "../servicces/paystack.js";
import { BadRequestError } from "../utils/error/custom.js";


export const listBanks = asyncWrapper(async(req, res) => {
    try{
        const avalableBanks = await banks();
        if(!avalableBanks)
            throw new BadRequestError('Issue getting available Banks');

        return success(res, 200, undefined, avalableBanks)
    }catch(e){
        return error(res, e?.statusCode || 500, e)
    }
})

export const validateAccount = asyncWrapper(async(req, res) => {
    try{
        const { 
            body: { bankCode, accountNumber }
        } = req;
        if(!bankCode || !accountNumber){
            throw new BadRequestError('Please provide account number and bank');
        }
        const accDeatails = await verifyAccount(req.body);
        console.log("accDeatails", accDeatails);
        return success(res, 200, undefined, accDeatails);
    }catch(e){
        return error(res, e?.statusCode || 500, e)
    }
})

export const tranfer = asyncWrapper(async(req, res) => {
    try{
        const {
            body:{ username, bankCode, accountNumber, accountName, amount }
        } = req;
        console.log(req.body)


        const user = await User.findOne({ username });
        if(!user){
            throw new BadRequestError('No user Found');
        }
        console.log(user);
        if(user.walletBalance >= amount){
        const resCode = await createRecipient(accountNumber, bankCode, accountName);
             const trnx = await payout(resCode, amount);
             if(trnx.data.status === "success"){
                user.walletBalance -= amount 
                await user.save();
             }else{
                throw new BadRequestError("Transaction was not proceed please try again latter")
             }
            }else{
                throw new BadRequestError("Insurficient Balance");
            }
        return success(res, 200, undefined, user)
    }catch(e){
        return error(res, e?.statusCode || 500, e)
    }
});

export const topUp = asyncWrapper(async(req, res) => {
    try{
        const { 
            body: { username, amount } 
        }= req;
        console.log(username)
        const user = await User.findOne({ username });
        console.log(user)
        if(!user){
            throw new BadRequestError("No user found please login again")
        }
        const paymentData = {
            email: user.email,
            amount: amount * 100,
            currency: "NGN",
            callback_url: "https://abank.vercel.app/api/verify-card-payment",
            reason: "Top Up Wallet",
          };
          const chargeResponse = await payWithCard(paymentData);
      if (!chargeResponse.status) {
        return sendResponse(
          res,
          200,
          'Failed to save card. Charge was not successful.'
        );
      }

      const data = {
        gateway: 'Paystack',
        message: 'Please use the authorization link to complete your payment.',
        authorization_url: chargeResponse.data.authorization_url,
      };
      return success(res, 200, undefined, data);
    }catch(e){
        return error(res, e?.statusCode || 500, e)
    }
})


export const verifyPaystack = asyncWrapper(async(req, res) => {
    try{
        const {
            query: { reference },
        } = req;

        if (!reference) {
            throw new BadRequestError('Transaction reference is required.');
          }
          const verificationResponse = await verifyPaystackTransaction(reference);
          if (!verificationResponse) {
            res.redirect(303, `https://abdullahibanking.vercel.app/login`)
          }
        console.log(verificationResponse);
        const user = await User.findOne({ email: verificationResponse.email });

        if (!user) {
            res.redirect(303, `https://abdullahibanking.vercel.app/login`)
            throw new NotFoundError(
              'User associated with this transaction not found.'
            );
          }

          if (verificationResponse.status === 'success') {
            const { authorization, reason } = verificationResponse;
      
            if (authorization) {
                const amount =  verificationResponse.amount / 100;
                user.walletBalance += amount;
                await user.save();
                res.redirect(303, "https://abdullahibanking.vercel.app/login");
            }
        }

    }catch(e){
        return error(res, e?.statusCode || 500, e);
    }
})