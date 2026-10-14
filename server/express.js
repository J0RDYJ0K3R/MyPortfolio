const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("../config/config");
const app = express();
app.use(helmet());
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: "32kb" }));
app.get("/", (req,res) => res.json({ message: "Welcome to MyPortfolio API!" }));
app.get("/api/test", (req,res) => res.json({ message: "API test successful!" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/qualifications", require("./routes/qualificationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use((req,res)=>res.status(404).json({ message: "Route not found" }));
app.use((err,req,res,next)=>{
  if (err instanceof SyntaxError && err.status === 400 && "body" in err)
    return res.status(400).json({ message: "Invalid JSON body" });
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});
module.exports = app;
