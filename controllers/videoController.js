import { videos } from "../db";

export const home = (req, res) => {
  res.render("Home", { pageTitle: "Home", videos });
};

export const search = (req, res) => {
  const {
    query: { term: searchTerm }
  } = req;
  res.render("Search", { searchTerm });
};

export const upload = (req, res) => res.render("upload");

export const videoDetail = (req, res) => res.render("videoDetail");

export const editVideo = (req, res) => res.render("editVideo");

export const deleteVideo = (req, res) => res.render("deleteVideo");
