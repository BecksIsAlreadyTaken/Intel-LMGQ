chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("content received")
    }
);