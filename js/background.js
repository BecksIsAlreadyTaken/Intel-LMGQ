// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.toBg === "true") {
//             chrome.storage.sync.get({ whitelist: [] }, function(items) { //check whitelist
//                 let f = false;
//                 for (i in items.whitelist) {
//                     if (items.whitelist[i].url == sender.tab.url) {
//                         f = true;
//                         break;
//                     }
//                 }
//                 chrome.storage.local.remove(["inWl", "currentUrl"], function() {});
//                 chrome.storage.local.set( //using local storage to store boolean inWl and current url of the tab
//                     { 'inWl': f, 'currentUrl': sender.tab.url },
//                     function() {
//                         // console.log('local: set inWl');
//                     });
//                 chrome.storage.local.get(null, function(items) {
//                     console.log(items);
//                 });
//                 sendResponse({ item: items }); //send response to content.js ******
//             });
//         }
//     });
var toggle = true;
chrome.browserAction.onClicked.addListener(function(tab) {
    toggle = !toggle;
    console.log(toggle);
    if (toggle) {
        chrome.browserAction.setIcon({ path: "on.png", tabId: tab.id });
        // chrome.tabs.executeScript(tab.id, { file: "toggleon.js" });
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tab = tabs[0];
            var url = tab.url;
            chrome.storage.sync.get(null, function(items) { //check whitelist
                let f = false;
                for (i in items.whitelist) {
                    if (items.whitelist[i].url == url) {
                        f = true;
                        break;
                    }
                }
                chrome.storage.local.remove(["inWl", "currentUrl"], function() {});
                chrome.storage.local.set( //using local storage to store boolean inWl and current url of the tab
                    { 'inWl': f, 'currentUrl': url },
                    function() {
                        // console.log('local');
                    });
                chrome.storage.local.get(null, function(items) {
                    console.log(items);
                });
                chrome.tabs.sendMessage(tabs[0].id, { state: "on" }, function(response) {
                    console.log(response);
                });
            });
        });
    } else {
        chrome.browserAction.setIcon({ path: "off.png", tabId: tab.id });
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { state: "off" }, function(response) {
                console.log(response);
            });
        });
        // chrome.tabs.executeScript(tab.id, { code: "console.log('off');" });
    }
});