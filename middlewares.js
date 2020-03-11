import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videos/" });

export const uploadVideo = multerVideo.single("videoFile");

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  res.locals.user = req.user || null;
  console.log(req.user);
  next();
};
