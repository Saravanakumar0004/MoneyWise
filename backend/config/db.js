const mongoose = require("mongoose");

// Reuse the connection across invocations in a serverless environment instead
// of reconnecting (and potentially hitting Atlas connection limits) on every request.
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected: " + conn.connection.host);
  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB Error: " + error.message);
    // IMPORTANT: do NOT process.exit() here. On Vercel this is a serverless
    // function, not a long-running server — exiting kills the whole
    // function invocation and turns every request into a 500, even ones
    // unrelated to the DB. Throw instead so the caller/route can respond
    // with a proper JSON error.
    throw error;
  }
};

module.exports = connectDB;