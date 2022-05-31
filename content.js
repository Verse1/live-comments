chrome.runtime.sendMessage({
  message: 'GET',
  id: new URLSearchParams(location.search).get('v'),
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.comments) {
    console.log(request.comments);
  }
});
