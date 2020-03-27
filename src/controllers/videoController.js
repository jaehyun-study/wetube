import routes from "../routes";
import Video from "../models/Video";

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

export const home = async (req, res) => {
  let videos;
  try {
    videos = await Video.find({})
      // .sort({ _id: -1 })
      .populate("creator");
  } catch (error) {
    videos = [];
    console.log(error);
  } finally {
    shuffleArray(videos); // :)
    res.render("home", { pageTitle: "Home", videos });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchTerm }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchTerm, $options: "i" }
    }).populate("creator");
  } catch (error) {
    console.log(error);
  }
  res.render("search", {
    pageTitle: `Search for ${searchTerm}`,
    searchTerm,
    videos
  });
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
    const video = await Video.findById(id).populate([
      { path: "creator", model: "User" },
      {
        path: "comments",
        model: "Comment",
        populate: { path: "creator", model: "User" }
      }
    ]);
    res.render("videoDetail", { pageTitle: video.title, video });
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
