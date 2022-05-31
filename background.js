chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.executeScript(tabId, {
      file: 'content.js',
    });
  }
});

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.message == 'GET' && request.id != null) {
    const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=50&order=relevance&textFormat=plainText&videoId=${request.id}&key=`;
    let comments;
    await $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        comments = filterComments(data.items);
      },
      error: function (xhr, status, error) {
        console.log(error);
      },
    });
  }
});

const filterComments = (comments) => {
  const timeStamp = new RegExp(/\d{2}:\d{2}/);

  const parsedComments = comments.map((comment) => {
    let unparsedComment = comment.snippet.topLevelComment.snippet;
    return {
      user: unparsedComment.authorDisplayName,
      text: unparsedComment.textDisplay,
    };
  });

  const filteredComments = parsedComments
    .filter((comment) => {
      return timeStamp.test(comment.text);
    })
    .map((comment) => {
      let time = comment.text.match(timeStamp)[0];
      time = time.split(':');
      time = parseInt(time[0]) * 60 + parseInt(time[1]);

      return {
        user: comment.user,
        text: comment.text,
        timeStamp: time,
      };
    });
  return filteredComments;
};
