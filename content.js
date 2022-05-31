chrome.runtime.sendMessage({
  message: 'GET',
  id: new URLSearchParams(location.search).get('v'),
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
          console.log(comment);
          comments.pop();
        }
      });
    }, 100);
  }
});
