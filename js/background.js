var toggle;
var request = new XMLHttpRequest(); // 
var url = "http://192.168.1.106:8000"; // cloud service server


if (!localStorage["blocked"]) { // monitor state on/off
    localStorage["blocked"] = false;
}

chrome.browserAction.onClicked.addListener(function(tab) {
    localStorage["blocked"] = !JSON.parse(localStorage["blocked"]);
    toggle = !JSON.parse(localStorage["blocked"]);
    if (toggle) {
        chrome.browsingData.remove({ // clear browsing data (cached images) to monitor requests
            since: 0
        }, {
            cache: true,
            appcache: true
        }, function() {});
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
            chrome.storage.sync.get(null, function(items) { //check the whitelist
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
        // chrome url check     
        var reg = new RegExp("chrome-extension://");
        var whitelistChecked;
        if (typeof localStorage["current_in_WL"] !== "undefined" &&
            localStorage["current_in_WL"] !== "undefined") {
            whitelistChecked = JSON.parse(localStorage["current_in_WL"]);
        }
        var chromeChecked = reg.test(details.url);
        if (chromeChecked) {} else {
            if (whitelistChecked) {
                // do something if current url is in the whitelist
            } else { // interacting with server 
                request.open("POST", url, false);
                request.setRequestHeader("Content-Type", "application/json");
                request.send(details.url);
                if (request.responseText == 1) {
                    // redirect 
                    return {
                        redirectUrl: chrome.runtime.getURL('images/blocked.svg')
                    };
                }
            }
        }

    }
}, {
urls: ["<all_urls>"],
types: ["image"]
}, ["blocking"]);