import { error, success } from "../helpers/response.js"
import asyncWrapper from "../middlewares/async.js"
import User from "../models/user.js";
import { BadRequestError, NotFoundError } from "../utils/error/custom.js";


export const signUp = asyncWrapper(async(req, res, next) => {
    try{
        const { body } = req;
        const isUser = await User.findOne({ email: body.email});
        if(isUser){
            throw new BadRequestError("there an existing user with this email");
        }
        const user = await User.create(body);
        return success(res, 201, user);
    }catch(e){
        return error(res, e?.statusCode || 500, e)
    }
})

export const login = asyncWrapper(async(req, res) => {
    try{
        const { 
            body: {email, password } 
        }= req;
        console.log(req.body);
        const user = await User.findOne({ email });
        if(email === "" || password === "") {
            throw new BadRequestError('Please enter your email and password to continue')
        }
        if(!user){
            throw new NotFoundError("No User with this email")
        }
        if(password !== user.password){
            throw new BadRequestError("Incorrect password")
        }
        return success(res, 200, user);
    }catch(e){
        return error(res, e?.statusCode || 500, e)
    }
})