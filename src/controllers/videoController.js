import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchTerm }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({ title: { $regex: searchTerm, $options: "i" } });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchTerm, videos });
};

export const getUpload = (req, res) => res.render("upload");
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
    user
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: user.id
  });
  user.videos.push(newVideo.id);
  user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    res.render("videoDetail", { pageTitle: "videoDetail", video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    console.log(video);
    if (video.creator != user.id) {
      throw `edit: ${video.creator} != ${user.id}`;
    }
    res.render("editVideo", { pageTitle: `Edit: ${video.title}`, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator != user.id) {
      throw `delete: ${video.creator} != ${user.id}`;
    }
    await Video.findOneAndDelete({ _id: id });
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register View

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    console.log("postRegisterView: " + error.message);
    res.status(400);
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    video.save();
    res.status(200);
  } catch (error) {
    console.log("postAddComment: " + error.message);
    res.status(400);
  } finally {
    res.end();
  }
};
