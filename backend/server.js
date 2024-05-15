import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
// import cors from 'cors';
import countRoutes from "./routes/counts.js";

import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import uploadRoutes from "./routes/upload.js";
import ConnectDb from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "path";

dotenv.config();

ConnectDb();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    message: "Api is running...",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", countRoutes);

app.use("/api/users", usersRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const __dir = path.resolve();
app.use("/upload", express.static(__dir.concat("/uploads")));

app.use(errorHandler);

const port = process.env.PORT | 5000;

app.listen(port, () => {
  console.log(
    `App is running in ${process.env.NODE_MODE} mode at port ${port}`.bgGreen
  );
});
