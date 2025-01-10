import { Router } from 'express';
import { login, signUp } from '../controllers/auth.js';
import {
  listBanks,
  topUp,
  tranfer,
  validateAccount,
  verifyPaystack,
} from '../controllers/user.js';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);

router.get('/banks', listBanks);
router.post('/account/verify', validateAccount);
router.post('/transfer', tranfer);
router.post('/topWallet', topUp);
router.get('/verify-card-payment', verifyPaystack);

export default router;
