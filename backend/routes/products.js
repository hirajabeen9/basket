import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProductById,
  getAllProductsCount
} from "../controllers/products.js";
import { adminHandler, authHandler } from "../middlewares/authHandler.js";
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProductById);
router.post("/", authHandler, adminHandler, createProduct);
router.get("/count", authHandler, adminHandler, getAllProductsCount); // Add this route
router.put("/:id", authHandler, adminHandler, updateProduct);

export default router;
