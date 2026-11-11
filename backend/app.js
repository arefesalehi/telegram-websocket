const express = require("express");
const path = require("path");
const cors = require("cors");
const NamespaceRouter = require("./routes/Namespace");
const UserRouter = require("./routes/User.routes");

const app = express();

app.set("trust proxy", 1);

//* CORS Policy
app.use(
  cors({
    origin: [
      "https://telegram-frontend-phi.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

//* BodyParser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Health check (برای UptimeRobot)
app.get("/", (req, res) => res.status(200).send("OK"));

//* Routes
app.use("/api/namespaces", NamespaceRouter);
app.use("/api/auth", UserRouter);

module.exports = app;