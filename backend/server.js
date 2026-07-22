const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();

// Support multiple comma separated origins (local dev + deployed frontend)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, server-to-server, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB (connection is cached/reused across serverless invocations,
// see config/db.js — do NOT crash the process if it fails)
connectDB().catch((err) => console.error("❌ Initial DB connection failed:", err.message));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => res.json({ message: "MoneyWise API running! 💰" }));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Centralized error handler — without this, thrown/async errors (e.g. CORS
// rejection, DB errors) can bubble up as raw 500s with no JSON body, or crash
// the serverless function
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Only call app.listen when run directly (local `node server.js` / nodemon).
// On Vercel, the app is imported and wrapped as a serverless function instead —
// calling app.listen there does nothing useful and app.listen + process.exit
// patterns are what break deployments.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log("✅ Server running on http://localhost:" + PORT));
}

module.exports = app;