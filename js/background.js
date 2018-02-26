var toggle;
if (!localStorage["blocked"]) {
    localStorage["blocked"] = false;
}

chrome.browserAction.onClicked.addListener(function(tab) {
    localStorage["blocked"] = !JSON.parse(localStorage["blocked"]);
    toggle = !JSON.parse(localStorage["blocked"]);
    if (toggle) {
        chrome.browsingData.remove({
            since: 0
        }, {
            cache: true,
            appcache: true,
        }, function() {
            console.log("remove");
        });
        chrome.browserAction.setIcon({
            path: "images/on.png"
        });
    } else {
        chrome.browserAction.setIcon({
            path: "images/off.png"
        });
    }
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if (JSON.parse(localStorage["blocked"])) {
        localStorage["current_in_WL"] = true;
    } else {
        chrome.tabs.query({
            'active': true
        }, function(tabs) {
            chrome.storage.sync.get(null, function(items) { //check whitelist
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
        // check if base64 then add tag
        localStorage[details.url] = true; // interacting with server
    }
}, {
    urls: ["<all_urls>"],
    types: ["image"]
}, ["blocking"]);

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
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
        // chrome url check
        // if base64 
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

chrome.webRequest.onResponseStarted.addListener(function(details) {
    // gif filtering
}, {
    urls: ["<all_urls>"],
    types: ["image"]
}, ["responseHeaders"]);