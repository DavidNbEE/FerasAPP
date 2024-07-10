import express from "express";
import { Login, Logout, Register, getUsers } from "../controller/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/RefToken.js";

import { getCheckInTime } from "../controller/Users.js";
import { saveCheckInTime } from "../controller/Users.js";
import { saveCheckOutTime } from "../controller/Users.js";
import { getactivity } from "../controller/Users.js";
const router = express.Router();

router.get('/users', verifyToken, getUsers)
router.post('/users', Register)
router.post('/login', Login)
router.get('/token', refreshToken)
router.delete('/logout', Logout)
router.post('/getCheckInTime', getCheckInTime);
router.get('/getCheckInTime', getCheckInTime);
router.post('/checkin',saveCheckInTime)
router.post('/checkout',saveCheckOutTime)
router.get('/getactivity', getactivity)

export default router