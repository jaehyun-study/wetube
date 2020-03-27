// Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users

const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";

// Videos

const VIDEOS = "/videos";
const UPLOAD = "/upload";
const EDIT = "/edit";
const DELETE = "/delete";
const VIDEO_ID = "/:id";
const VIDEO_DETAIL = VIDEO_ID;
const EDIT_VIDEO = VIDEO_ID + EDIT;
const DELETE_VIDEO = VIDEO_ID + DELETE;

// GitHub

const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// API

const API = "/api";
const CHECK_LOGIN = "/check-login";
const REGISTER_VIEW = "/:id/view";
const ADD_COMMENT = "/:id/add-comment";
const DELETE_COMMENT = "/:id/delete-comment";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: id => {
    if (id) {
      return `${USERS}/${id}`;
    } else {
      return USER_DETAIL;
    }
  },
  me: ME,
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: id => {
    if (id) {
      return `${VIDEOS}/${id}`;
    } else {
      return VIDEO_DETAIL;
    }
  },
  editVideo: id => {
    if (id) {
      return `${VIDEOS}/${id}${EDIT}`;
    } else {
      return EDIT_VIDEO;
    }
  },
  deleteVideo: id => {
    if (id) {
      return `${VIDEOS}/${id}${DELETE}`;
    } else {
      return DELETE_VIDEO;
    }
  },
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  api: API,
  requestLogin: CHECK_LOGIN,
  registerView: REGISTER_VIEW,
  addComment: ADD_COMMENT,
  deleteComment: DELETE_COMMENT
};

export default routes;
