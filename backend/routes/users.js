import express from 'express';
import {
    getUserProfile,
    getAllUsers,
    makeUserAdmin,
    getAllUsersCount,
    updatePassword
} from '../controllers/users.js';
import { authHandler ,adminHandler} from '../middlewares/authHandler.js';
const router = express.Router();

router.get('/profile', authHandler, getUserProfile);
router.post('/updatePassword', authHandler,updatePassword)

router.get("/", getAllUsers);
router.put('/:userId', authHandler, makeUserAdmin);
router.get("/count", authHandler, adminHandler, getAllUsersCount); // Add this route



export default router;
