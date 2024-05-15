import express from "express";
import {
  getUsers,
  getProducts,
  getOrders
} from "../controllers/count.js";
import { adminHandler, authHandler } from "../middlewares/authHandler.js";

const router = express.Router();

// Route to get the count of users
router.get("/users/count", authHandler, getUsers);

// Route to get the count of products
router.get("/products/count", authHandler, getProducts);

// Route to get the count of orders
router.get("/orders/count", authHandler, getOrders);

export default router;
