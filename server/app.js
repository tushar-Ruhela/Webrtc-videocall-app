const express = require("express");
const http = require("http");
const cors = require("cors");
const initSocket = require("./index");
const signupRoute = require("./Routes/signup");
const loginRoute = require("./Routes/login.js");
const connectDB = require("./config/db.js");
const app = express();

const server = http.createServer(app);

app.use(cors({ origin:import.meta.env.origin || "http://localhost:5173" , methods: ["GET", "POST"] }));
app.use(express.json());

app.use("/api", signupRoute);
app.use("/api",loginRoute);
connectDB();
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
