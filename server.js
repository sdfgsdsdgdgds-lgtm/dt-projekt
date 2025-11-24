import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import dotenv from "dotenv";
import { initDB, db } from "./db/connect.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import browseRoutes from "./routes/browse.js";

dotenv.config();
await initDB();

const app = express();
const PgStore = pgSession(session);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    store: new PgStore({
      pool: db
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", browseRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
