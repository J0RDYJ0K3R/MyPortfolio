const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./server/express");
async function start() {
  if (!config.mongoUri || !config.jwtSecret || config.jwtSecret.length < 32) {
    console.error("Missing MONGO_URI or JWT_SECRET (minimum 32 characters) in root .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB Connected Successfully!");
    app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
if (require.main === module) start();
module.exports = { start };
