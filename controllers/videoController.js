export const home = (req, res) => res.render("Home", { pageTitle: "Home" });

export const search = (req, res) => {
  const {
    query: { term: searchTerm }
  } = req;
  res.render("Search", { searchTerm });
};

export const videos = (req, res) => res.render("Videos");

export const upload = (req, res) => res.render("Upload");

export const videoDetail = (req, res) => res.render("Video Detail");

export const editVideo = (req, res) => res.render("Edit Video");

export const deleteVideo = (req, res) => res.render("Delete Video");
