import routes from "../routes";
import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("Home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("Home", { pageTitle: "Home", videos: [] });
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
  res.render("Search", { pageTitle: "Search", searchTerm, videos });
};

export const getUpload = (req, res) => res.render("upload");
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path },
    user
  } = req;
  const newVideo = await Video.create({
    fileUrl: path,
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
    const video = await Video.findById(id).populate("creator");
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
    if (video.creator.id !== user.id) {
      throw "edit: video.creator.id !== user.id";
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
    if (video.creator.id !== user.id) {
      throw "delete: video.creator.id !== user.id";
    }
    await Video.findOneAndDelete({ _id: id });
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// API

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
