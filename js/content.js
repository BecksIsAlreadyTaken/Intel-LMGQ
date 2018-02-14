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
//iframe background ajax 缩略图 属性里的链接
function getIframeImgUrl() {}

function getBgImgUrl() {}

function getAjaxImgUrl() {}

function blockNsfwImgs() {
    console.log("nsfw");
}

function connectToServer() {}

function checkWhiteList() { //2018.2.15 如何将回调函数的局部变量值保存并传出
    chrome.storage.sync.get({ whitelist: [] }, function(items) {
        chrome.runtime.sendMessage({ toBg: "true" }, function(response) {
            console.log(response.currentUrl);
            for (i in items.whitelist) {
                if (items.whitelist[i].url == response.currentUrl) {
                    var f = true;
                    break;
                }
            }
        });
    });
    return;
}

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