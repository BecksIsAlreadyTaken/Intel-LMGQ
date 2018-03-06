var toggle = true;

var url = "http://192.168.1.106:8000"; // cloud service server

var cache = new Array();

function delHeader(str) {
    var test = "http://192.168.1.106:8000/?url=";
    var temp = str;
    var index = temp.indexOf(test);
    while (index != -1) {
        temp = temp.substr(index + test.length);
        index = temp.indexOf(test);
    }
    return temp;
}

function checkCache(str) {
    var f = false;
    for (var i = 0; i < cache.length; i++) {
        if (cache[i].url == str)
            return cache[i].result;
    }
    return -1;
}

function checkUrl(str) {
    var testip = "http://192.168.1.106:8000/?url=";
    var temp = str;
    var index = temp.indexOf(testip);
    if (index == -1) return 0;
    else return 1;
}

chrome.browserAction.onClicked.addListener(function (tab) {
    toggle = !toggle;
    if (toggle) {
        chrome.browsingData.remove({ // clear browsing data (cached images) to monitor requests
            since: 0
        }, {
            cache: true,
            appcache: true
        }, function () {});
        chrome.browserAction.setIcon({
            path: {
                "64": "/images/on.png"
            }
        });
    } else {
        chrome.browserAction.setIcon({
            path: {
                "64": "/images/off.png"
            }
        });
    }
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    // chrome check
    var reg = new RegExp("chrome-extension://");
    var chromeChecked = reg.test(details.url);
    if (chromeChecked) {} else {
        if (toggle) {
            if (checkUrl(details.url) == 1) {} else {
                if (checkCache(details.url) == -1) {
                    return {
                        redirectUrl: "http://192.168.1.106:8000" + "?url=" + details.url
                    };
                } else if (checkCache(details.url) == 1) {
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

chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if (toggle) {
        var flag = false;
        var exit = false;
        for (var i = 0; i < details.responseHeaders.length; i++) {
            if (details.responseHeaders[i].name.toLowerCase() == 'content-type') {
                var result = details.responseHeaders[i].value;
                if (result == '1') {
                    flag = true;
                    cache.push({
                        url: delHeader(details.url),
                        result: 1
                    })
                    break;
                } else if (result == '0') {
                    cache.push({
                        url: delHeader(details.url),
                        result: 0
                    })
                    break;
                } else {
                    exit = true;
                    break;
                }
            }
        }
        if (exit) {} else {
            if (flag) {
                return {
                    redirectUrl: chrome.runtime.getURL('images/blocked.svg')
                };
            } else {
                var temp = delHeader(details.url);
                return {
                    redirectUrl: temp
                };
            }
        }
    }
}, {
    urls: ["<all_urls>"],
    types: ["image"]
}, ["blocking", "responseHeaders"]);