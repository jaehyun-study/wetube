import passport from "passport";
import User from "./models/User";
import GithubStrategy from "passport-github";
import NaverStrategy from "passport-naver";
import {
  githubLoginCallback,
  naverLoginCallback
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

const siteUrl = process.env.PRODUCTION
  ? "https://wetube-youtube-clone.herokuapp.com"
  : "http://localhost:4000";

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${siteUrl}${routes.githubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: `${siteUrl}${routes.naverCallback}`
    },
    naverLoginCallback
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
