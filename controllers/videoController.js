import routes from "../routes";

export const home = (req, res) => {
  res.render("Home", { pageTitle: "Home" });
};

export const search = (req, res) => {
  const {
    query: { term: searchTerm }
  } = req;
  res.render("Search", { pageTitle: "Search", searchTerm });
};

export const getUpload = (req, res) => res.render("upload");
export const postUpload = (req, res) => {
  const {
    body: { file, title, Description }
  } = req;
  // todo: upload video
  res.redirect(routes.videoDetail(324393));
};

export const videoDetail = (req, res) => res.render("videoDetail");

export const editVideo = (req, res) => res.render("editVideo");

export const deleteVideo = (req, res) => res.render("deleteVideo");
