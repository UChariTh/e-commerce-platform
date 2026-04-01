// // import dotenv from "dotenv";
// // dotenv.config();

// import "dotenv/config";


// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";

// import authRoutes from "./routes/auth.route.js";
// import productRoutes from "./routes/product.route.js";
// import cartRoutes from "./routes/cart.route.js";
// import couponRoutes from "./routes/coupon.route.js";
// import paymentRoutes from "./routes/payment.route.js";
// import analyticsRoutes from "./routes/analytics.route.js";
// import categoryRoutes from "./routes/category.route.js";
// import supportRoutes from "./routes/support.route.js";

// import { connectDB } from "./lib/db.js";

// const app = express();
// const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

// app.use(
// 	cors({
// 		origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
// 		credentials: true,
// 	})
// );

// app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/coupons", couponRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/support", supportRoutes);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

// app.listen(PORT, () => {
// 	console.log("Server is running on http://localhost:" + PORT);
// 	connectDB();
// });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, ".env") });


console.log("--- DEBUGGING ---");
console.log("Current Directory:", __dirname);
console.log("MONGO_URI from Env:", process.env.MONGO_URI ? "FOUND ✅" : "NOT FOUND ❌");
console.log("-----------------");

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import categoryRoutes from "./routes/category.route.js";
import supportRoutes from "./routes/support.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/support", supportRoutes);

// Production Configuration
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    
    if (process.env.MONGO_URI) {
        connectDB();
    } else {
        console.error("CRITICAL ERROR: MONGO_URI is still undefined. Check your .env file!");
    }
});