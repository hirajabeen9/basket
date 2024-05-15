import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/order.js';
import User from '../models/user.js';
import Product from '../models/product.js';


// // Route to get all users


export const getUsers = asyncHandler(async (req, res) => {
    let users = await User.countDocuments({});
    res.json(users);
  });

// Route to get all products


export const getProducts = asyncHandler(async (req, res) => {
    let products = await Product.countDocuments({});
    res.json(products);
  });
// Route to get all orders


export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.countDocuments({});
    res.json(orders);
  });

