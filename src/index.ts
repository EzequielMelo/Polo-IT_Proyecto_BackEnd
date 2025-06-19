import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Permitir solicitudes desde cualquier origen
app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "undefined"} mode`,
  );
});
