import Video from "../models/Video";
import Comment from "../models/Comment";

export const getCheckLogin = (req, res) => {
  res.status(200);
  res.json({ login: req.user !== undefined });
};

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
    res.json({
      id: newComment.id,
      text: newComment.text,
      creator: { id: user.id, name: user.name, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    console.log("postAddComment: " + error.message);
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id },
    body: { commentId }
  } = req;
  try {
    await Comment.findByIdAndDelete(commentId);
    const video = await Video.findById(id);
    video.comments = video.comments.filter(id => id != commentId);
    video.save();
    res.status(200);
  } catch (error) {
    console.log("postDeleteComment: " + error.message);
    res.status(400);
  } finally {
    res.end();
  }
};
