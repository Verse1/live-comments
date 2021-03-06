chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status == 'complete' &&
    tab.active &&
    /^https:\/\/www.youtube.com\/watch\?/.test(tab.url)
  ) {
    chrome.tabs.insertCSS(tabId, {
      file: 'content.css',
    });
    chrome.tabs.executeScript(tabId, {
      file: 'content.js',
    });
  }
});

const key = '';

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  let comments = [];
  let page;
  let nextPage = true;
  if (request.message == 'GET' && request.id != null) {
    let url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=relevance&searchTerms=%3A&textFormat=plainText&videoId=${request.id}&key=${key}`;
    while (nextPage) {
      await $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          comments = comments.concat(filterComments(data.items));
          if (!data.nextPageToken) {
            nextPage = false;
          }
          page = data.nextPageToken;
        },
        error: function (xhr, status, error) {
          console.log(error);
        },
      });
      url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=relevance&pageToken=${page}&searchTerms=%3A&textFormat=plainText&videoId=${request.id}&key=${key}`;
    }
    chrome.tabs.sendMessage(sender.tab.id, { comments });
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
