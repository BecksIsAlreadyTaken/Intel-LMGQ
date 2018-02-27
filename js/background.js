var toggle;
if (!localStorage["blocked"]) {
    localStorage["blocked"] = false;
}

chrome.browserAction.onClicked.addListener(function (tab) {
    localStorage["blocked"] = !JSON.parse(localStorage["blocked"]);
    toggle = !JSON.parse(localStorage["blocked"]);
    if (toggle) {
        chrome.browsingData.remove({
            since: 0
        }, {
            cache: true,
            appcache: true
        }, function () {});
        chrome.browserAction.setIcon({
            path: "images/on.png"
        });
    } else {
        chrome.browserAction.setIcon({
            path: "images/off.png"
        });
    }
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (JSON.parse(localStorage["blocked"])) {
        localStorage["current_in_WL"] = true;
    } else {
        chrome.tabs.query({
            'active': true
        }, function (tabs) {
            chrome.storage.sync.get(null, function (items) { //check whitelist
                let f = false;
                for (i in items.whitelist) {
                    if (items.whitelist[i].url == tabs[0].url) {
                        f = true;
                        break;
                    }
                }
                if (f) localStorage["current_in_WL"] = true;
                else localStorage["current_in_WL"] = false;
            });
        });
        // interacting with server 
        // chrome url check     
        var reg = new RegExp("chrome-extension://");
        var chromeChecked = reg.test(details.url);
        if(chromeChecked) {}
        else localStorage[details.url] = true;
    }
}, {
    urls: ["<all_urls>"],
    types: ["image"]
}, ["blocking"]);

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        var whitelistChecked;
        var urlChecked;
        if (typeof localStorage["current_in_WL"] !== "undefined" &&
            localStorage["current_in_WL"] !== "undefined") {
            whitelistChecked = JSON.parse(localStorage["current_in_WL"]);
        }
        if (typeof localStorage[details.url] !== "undefined" &&
            localStorage[details.url] !== "undefined") {
            urlChecked = JSON.parse(localStorage[details.url]);
        }
        localStorage.removeItem(details.url);
        if (whitelistChecked) {

        } else if (urlChecked) return {
            redirectUrl: chrome.runtime.getURL('images/blocked.svg')
        };
    }, {
        urls: ["<all_urls>"],
        types: ["image"]
    }, ["blocking"]
);

// chrome.webRequest.onResponseStarted.addListener(function(details) {
//     // gif filtering
//     // check response header content type if image/gif 
// }, {
//     urls: ["<all_urls>"],
//     types: ["image"]
// }, ["responseHeaders"]);

// chrome.runtime.onMessage.addListener(function)