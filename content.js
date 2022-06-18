chrome.runtime.sendMessage({
  message: 'GET',
  id: new URLSearchParams(location.search).get('v'),
});

const commentInjector = (commentText) => {

  const vid = document.querySelector('.video-stream').getBoundingClientRect();
  const comment = document.createElement('div');

  comment.innerText = commentText;
  comment.style.position = 'absolute';
  comment.style.top = `${vid.top}px`;
  comment.style.left = `${vid.left}px`;
  comment.style.backgroundColor = 'black';
  comment.style.color = 'white';
  document.querySelector('body').append(comment);
}



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
          commentInjector(comment.text);
          comments.pop();
        }
      });
    }, 100);
  }
});

