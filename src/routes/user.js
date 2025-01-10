import { Router } from "express";
import { login, signUp } from "../controllers/auth.js";
import { listBanks, tranfer, validateAccount } from "../controllers/user.js";


const router = Router();

router.post('/signup',  signUp);
router.post('/login', login);

router.get('/banks', listBanks);
router.post('/account/verify', validateAccount);
router.post('/transfer', tranfer)


export default router