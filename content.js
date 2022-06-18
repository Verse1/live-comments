chrome.runtime.sendMessage({
  message: 'GET',
  id: new URLSearchParams(location.search).get('v'),
});

const commentInjector = (commentText) => {
  const vid = document.querySelector('.video-stream').getBoundingClientRect();
  const comment = document.createElement('div');

  comment.classList.add('comment');
  comment.innerText = commentText;
  comment.style.position = 'absolute';
  comment.style.top = `${vid.top}px`;
  comment.style.left = `${vid.left}px`;
  comment.style.backgroundColor = 'black';
  comment.style.color = 'white';
  document.querySelector('body').append(comment);
};

const commentRemover = () => {
  const comment = document.querySelector('.comment');

  if (comment) {
    comment.remove();
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.comments) {
    let comments = request.comments.sort((a, b) => {
      return b.timeStamp - a.timeStamp;
    });
    console.log(comments);
    setInterval(() => {
      comments.forEach((comment) => {
        videoTime = Math.floor(
          document.querySelector('.video-stream').currentTime
        );
        if (comment.timeStamp == videoTime) {
          console.log(comment);
          commentRemover();
          commentInjector(comment.text);
          comments.pop();
        }
      });
    }, 100);
  }
});
