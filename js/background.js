var toggle;
var request = new XMLHttpRequest();

var url = "http://192.168.1.106:8000";


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
            appcache: true
        }, function() {});
        chrome.browserAction.setIcon({
            path: "images/on.png"
        });
        // popup here
        // popup onClicked send message to content
        // popup button not switch
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
        // chrome url check     
        var reg = new RegExp("chrome-extension://");
        var chromeChecked = reg.test(details.url);

        if (chromeChecked) {} else { // interacting with server 
            request.open("POST", url, false);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(details.url);
            if (request.responseText == 1) localStorage[details.url] = true;
            console.log(details.url);
        }
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

// chrome.webRequest.onCompleted.addListener(function(details) {
//     var reg = new RegExp("chrome-extension://");
//     var chromeChecked = reg.test(details.url);
//     var request = new XMLHttpRequest();
//     var url = "http://192.168.1.106:8000"
//     request.open("GET", url, false);
//     if (chromeChecked) {} else {
//         request.send(details.url);
//         if(request.responseText == 1) localStorage[details.url] = true;
//     }
//     console.log(details);
//     var whitelistChecked;
//     var urlChecked;
//     if (typeof localStorage["current_in_WL"] !== "undefined" &&
//         localStorage["current_in_WL"] !== "undefined") {
//         whitelistChecked = JSON.parse(localStorage["current_in_WL"]);
//     }
//     if (typeof localStorage[details.url] !== "undefined" &&
//         localStorage[details.url] !== "undefined") {
//         urlChecked = JSON.parse(localStorage[details.url]);
//     }
//     localStorage.removeItem(details.url);
//     if (whitelistChecked) {

//     } else if (urlChecked) return {
//         redirectUrl: chrome.runtime.getURL('images/blocked.svg')
//     };
// }, {
//     urls: ["<all_urls>"],
//     types: ["image"]
// }, ["responseHeaders"]);