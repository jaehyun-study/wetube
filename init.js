import "./db";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const handleListening = () =>
  console.log(`✅ Listening on: http://localhost:${port}`);

app.listen(port, handleListening);
