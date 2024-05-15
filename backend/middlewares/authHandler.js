import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';

export const authHandler = asyncHandler(async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      let [, token] = req.headers.authorization.split(' ');
      const { _id } = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(_id).select('-password');
      req.user = user;
      next();
    } catch (error) {
      res.statusCode = 401;
      throw new Error('Unauthorized');
    }
  } else {
    res.statusCode = 401;
    throw new Error('Unauthorized');
  }
});

export const adminHandler = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.statusCode = 403;
    throw new Error('Forbidden');
  }
});
