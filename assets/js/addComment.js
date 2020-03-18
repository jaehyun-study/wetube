import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const commentText = document.getElementById("jsCommentText");

const increseCommentNumber = () => {
  const newNumber = parseInt(commentNumber.innerHTML, 10) + 1;
  commentNumber.innerHTML = newNumber;
  if (newNumber === 1) {
    commentText.innerHTML = " comment";
  } else {
    commentText.innerHTML = " comments";
  }
};

const addComment = comment => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const res = await axios({
    url: `/api/${videoId}/add-comment`,
    method: "post",
    data: {
      comment
    }
  });
  if (res.status === 200) {
    addComment(comment);
    increseCommentNumber();
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const init = () => {
  addCommentForm.addEventListener("submit", handleSubmit);
};

if (addCommentForm) {
  init();
}
