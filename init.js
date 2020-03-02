import dotenv from "dotenv";
import app from "./app";
import "./db";
import "./models/Video";
import "./models/Comment";

dotenv.config();

const port = process.env.PORT;

const handleListening = () =>
  console.log(`✅ Listening on: http://localhost:${port}`);

app.listen(port, handleListening);
