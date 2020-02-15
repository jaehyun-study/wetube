import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

const handleListening = () =>
  console.log(`Listening on: http://localhost:${port}`);

const handleHome = (req, res) => res.send("Home :)");
const handleProfile = (req, res) => res.send("Profile");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

app.get("/", handleHome);
app.get("/profile", handleProfile);

app.listen(port, handleListening);
