function getImgUrl() {
    var img = document.getElementsByTagName('img');
    img.className = 'test';
    var src = "";
    for (var i = 0; i < img.length; i++) {
        src += img[i].src;
        src += "\n";
    }
    console.log(src);
    console.log(document.images.length); // img num
}

function getIframeImgUrl() {}

function getBgImgUrl() {}

function getAjaxImgUrl() {}

function blockNsfwImgs() {
    console.log("nsfw");
}

function connectToServer() {}

function returnToNormal() {
    console.log("off");
}

chrome.runtime.sendMessage({ toBg: "true" }, function(response) {});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.state === "on") {
            getImgUrl();
            chrome.storage.local.get(null, function(items) { //get current url and start processing the imgs
                console.log(items);
                if (items.inWl) {} else {
                    blockNsfwImgs();
                }
            });
            chrome.storage.local.remove(["inWl", "currentUrl"], function() {});
            sendResponse({ resp: 'turn on' });
        } else if (request.state === "off") {
            returnToNormal();
            sendResponse({ resp: 'turn off' });
        }
    });