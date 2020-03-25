import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL_PROD, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.once("open", () => console.log("✅ Connected to DB"));
db.on("error", error => console.log(`❌ Error on DB: ${error}`));
