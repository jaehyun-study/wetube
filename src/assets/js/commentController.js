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

const checkLogin = async () => {
  const res = await axios({
    url: "/api/check-login",
    method: "get"
  });
  if (!res.data.login) {
    window.location.href = "/login";
  }
};

const addComment = newComment => {
  console.log(newComment.creator);
  const li = document.createElement("li");
  li.id = newComment.id;
  li.innerHTML = `<div class="video-comment__author-container">
  <a href="/users/${newComment.creator.id}">
  <img class="video__author-avatar" src="${newComment.creator.avatarUrl}">
  </a>
  <a href="/users/${newComment.creator.id}">
  <span class="video__author-name">${newComment.creator.name}</span>
  </a>
  </div>`;
  const commentBody = document.createElement("div");
  commentBody.className = "video-comment__body";
  li.appendChild(commentBody);
  const commentText = document.createElement("span");
  commentText.innerText = newComment.text;
  commentBody.appendChild(commentText);
  const commentDeleteButton = document.createElement("i");
  commentDeleteButton.className = "fas fa-trash-alt";
  commentDeleteButton.dataset.id = newComment.id;
  commentDeleteButton.addEventListener("click", sendDeleteComment);
  commentBody.appendChild(commentDeleteButton);
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
    addComment(res.data);
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
  const commentInput = addCommentForm.querySelector("input");
  commentInput.addEventListener("focus", checkLogin);
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
