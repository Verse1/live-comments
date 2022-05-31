chrome.runtime.sendMessage({
  message: 'GET',
  id: new URLSearchParams(location.search).get('v'),
});
