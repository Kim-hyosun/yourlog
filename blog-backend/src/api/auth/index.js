import Router from 'koa-router';
import * as authCtrl from './auth.ctrl.js';
import rateLimit from '../../lib/rateLimit.js';

const auth = new Router();

// 무차별 대입(brute-force) 방지: IP당 15분에 20회로 제한.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

auth.post('/register', authLimiter, authCtrl.register);
auth.post('/login', authLimiter, authCtrl.login);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

export default auth;
