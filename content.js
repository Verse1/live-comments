chrome.runtime.sendMessage({
  message: 'GET',
  id: new URLSearchParams(location.search).get('v'),
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const commentRemover = () => {
    const comment = document.querySelector('.comment');

    if (comment) {
      comment.remove();
    }
  };

  const commentInjector = (commentText) => {
    const vid = document.querySelector('.video-stream').getBoundingClientRect();
    const comment = document.createElement('div');

    comment.classList.add('comment');
    comment.innerText = commentText;

    comment.style.top = `${vid.bottom}px`;
    comment.style.left = `${vid.right}px`;

    document.querySelector('body').append(comment);
  };

  if (request.comments) {
    let comments = request.comments.sort((a, b) => {
      return b.timeStamp - a.timeStamp;
    });
    setInterval(() => {
      comments.forEach((comment) => {
        videoTime = Math.floor(
          document.querySelector('.video-stream').currentTime
        );
        if (comment.timeStamp == videoTime) {
          commentRemover();
          commentInjector(comment.text);
          comments.pop();
        }
      });
    }, 100);
  }
});
