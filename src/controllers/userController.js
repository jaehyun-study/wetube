import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password != password2) {
    req.flash("error", "New passwords don't match. 🤔");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = passport.authenticate("local", {
  successRedirect: routes.home,
  failureRedirect: routes.login,
  successFlash: "Welcome! 😀",
  failureFlash: "Check email or password. 🤔"
});

export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome! 😀",
  failureFlash: "Check email or password. 🤔"
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id: githubId, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.email = email;
      user.name = user.name ? user.name : name;
      user.githubId = githubId;
      user.avatarUrl = user.avatarUrl ? user.avatarUrl : avatarUrl;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        email,
        name,
        githubId,
        avatarUrl
      });
      return cb(null, newUser);
    }
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const naverLogin = passport.authenticate("naver", {
  successFlash: "Welcome! 😀",
  failureFlash: "Check email or password. 🤔"
});

export const naverLoginCallback = async (_, __, profile, cb) => {
  console.log("❗️ NAVER Callback");
  console.log(profile);
  const {
    _json: { id: naverId }
  } = profile;
  try {
    const name = naverId;
    const email = `${naverId}@${naverId}.naver.com`;
    const user = await User.findOne({ email });
    if (user) {
      user.email = email;
      user.name = user.name ? user.name : name;
      user.naverId = naverId;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        email,
        name,
        naverId
      });
      return cb(null, newUser);
    }
  } catch (error) {
    console.log(error.message);
    return cb(error);
  }
};

export const postNaverLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  req.flash("success", "Bye~ 🖐");
  res.redirect(routes.home);
};

export const users = (req, res) => res.render("users");

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: user.name, user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: user.name, user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => res.render("editProfile");

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
    user
  } = req;
  try {
    await User.findByIdAndUpdate(user.id, {
      name,
      email,
      avatarUrl: file ? file.location : user.avatarUrl
    });
    req.flash("success", "Profile updated. 🎵");
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) => {
  res.render("changePassword");
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword2 },
    user
  } = req;
  try {
    if (newPassword != newPassword2) {
      req.flash("error", "New passwords don't match. 🤔");
      res.status(400);
      res.redirect(routes.users + routes.changePassword);
    }
    await user.changePassword(oldPassword, newPassword);
    req.flash("success", "Password changed. 🔒");
    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    req.flash("error", error.message + ". 🤔");
    res.status = 400;
    res.redirect(routes.users + routes.changePassword);
  }
};
