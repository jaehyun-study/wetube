import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// const mongoUrl = process.env.PRODUCTION
//   ? process.env.MONGO_URL_PROD
//   : process.env.MONGO_URL;

const mongoUrl = process.env.MONGO_URL_PROD;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.once("open", () => console.log("✅ Connected to DB"));
db.on("error", error => console.log(`❌ Error on DB: ${error}`));
