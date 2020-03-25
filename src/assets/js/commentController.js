import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const commentText = document.getElementById("jsCommentText");
const deleteButtons = document.getElementsByClassName("fa-trash-alt");

const updateCommentNumber = delta => {
  const newNumber = parseInt(commentNumber.innerHTML, 10) + delta;
  commentNumber.innerHTML = newNumber;
  if (newNumber === 1) {
    commentText.innerHTML = " comment";
  } else {
    commentText.innerHTML = " comments";
  }
};

const addComment = (comment, id) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const i = document.createElement("i");
  li.id = id;
  span.innerHTML = comment;
  li.appendChild(span);
  i.className = "fas fa-trash-alt";
  i.dataset.id = id;
  i.addEventListener("click", sendDeleteComment);
  li.appendChild(i);
  commentList.prepend(li);
};

const sendAddComment = async () => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  const videoId = window.location.href.split("/videos/")[1];
  const res = await axios({
    url: `/api/${videoId}/add-comment`,
    method: "post",
    data: {
      comment
    }
  });
  if (res.status === 200) {
    addComment(comment, res.data.id);
    updateCommentNumber(+1);
    commentInput.value = "";
  }
};

const deleteComment = id => {
  document.getElementById(id).remove();
};

const sendDeleteComment = async event => {
  const commentId = event.target.dataset.id;
  const videoId = window.location.href.split("/videos/")[1];
  const res = await axios({
    url: `/api/${videoId}/delete-comment`,
    method: "post",
    data: {
      commentId
    }
  });
  if (res.status === 200) {
    deleteComment(commentId);
    updateCommentNumber(-1);
  }
};

const init = () => {
  // add
  addCommentForm.addEventListener("submit", sendAddComment);
  // delete
  for (let i in deleteButtons) {
    if (typeof deleteButtons[i] === "object") {
      deleteButtons[i].addEventListener("click", sendDeleteComment);
    }
  }
};

if (addCommentForm) {
  init();
}
