chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.executeScript(tabId, {
      file: 'content.js',
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'GET' && request.id != null) {
    const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=50&order=relevance&textFormat=plainText&videoId=${request.id}&key=`;
  }
});
