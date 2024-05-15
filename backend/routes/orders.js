import express from "express";
import {
  getMyOrders,
  getOrderById,
  getAllOrders,
  createOrder,
  updateOrderById,
  getAllOrdersCount,
  getSalesByMonthAndYear
} from "../controllers/orders.js";
import { adminHandler, authHandler } from "../middlewares/authHandler.js";
const router = express.Router();

router.get("/", authHandler, getMyOrders);
router.get("/:id", authHandler, getOrderById);
router.get("/", authHandler,getAllOrders);
router.get("/count", authHandler, adminHandler, getAllOrdersCount); // Add this route
router.post("/", authHandler, createOrder);
router.put("/:id", authHandler, updateOrderById);
router.get("/", authHandler, getSalesByMonthAndYear);


export default router;
