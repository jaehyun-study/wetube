import express from "express";
import routes from "../routes";
import {
  getCheckLogin,
  postRegisterView,
  postAddComment,
  postDeleteComment
} from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.get(routes.requestLogin, getCheckLogin);
apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, postDeleteComment);

export default apiRouter;
