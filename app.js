import express from "express";
import dotenv from "dotenv";
import conn from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import collectionRoute from "./routes/collectionRoute.js";
import collectionItemRoute from "./routes/collectionItemRoute.js";
import goalRoute from "./routes/goalRoute.js";

dotenv.config();

conn(); //connect to DATABASE

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ extended: true })); //post requests can be separated and read in the req body
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoute);
app.use("/", collectionRoute);
app.use("/", collectionItemRoute);
app.use("/", goalRoute);

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT + "...");
});
