function getImgUrl() {
    var img = document.getElementsByTagName('img');
    img.className = 'test';
    var src = "";
    for (var i = 0; i < img.length; i++) {
        src += img[i].src;
        src += "\n";
    }
    console.log(src);
    console.log(document.images.length);
}

function blockNsfwImgs() {
    console.log("nsfw");
}

function checkWhiteList() {
    var _inWhiteList = "false";
    chrome.storage.sync.get({ whitelist: [] }, function(items) {
        console.log('callback');
        chrome.tabs.query({ active: true }, function(tabs) {
            var currentUrl = tabs[0].url;
            console.log(currentUrl);
            for (i in items.whitelist) {
                if (items.whitelist[i] == currentUrl) {
                    _inWhiteList = "true";
                    break;
                }
            }
        });
    });
    return _inWhiteList;
}

function connectToServer() {}

chrome.runtime.sendMessage({ greeting: "hello" }, function(response) {
    console.log(response.farewell);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.state == "on") {
            console.log(request.state);
            getImgUrl();
            var resp = checkWhiteList();
            console.log(resp);
            sendResponse({ inWhiteList: resp });
            if (resp == "false")
                blockNsfwImgs();
        }

    });