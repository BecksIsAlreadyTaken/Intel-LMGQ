var toggle;

if (!localStorage["blocked"]) {
    localStorage["blocked"] = false;
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.toBg == "true") {
            if (JSON.parse(localStorage["blocked"]) === false) {
                var reg = new RegExp("chrome://extensions/");
                var flag = reg.test(sender.tab.url);
                if (flag) {

                } else {
                    chrome.storage.sync.get(null, function(items) { //check whitelist
                        let f = false;
                        for (i in items.whitelist) {
                            if (items.whitelist[i].url == sender.tab.url) {
                                f = true;
                                break;
                            }
                        }
                        chrome.storage.local.remove(["inWl", "currentUrl"], function() {}); //remove local storage if any
                        chrome.storage.local.set({ 'inWl': f, 'currentUrl': sender.tab.url }, function() {}); //using local storage to store boolean inWl and current url of the tab
                        chrome.storage.local.get(null, function(items) { console.log(items); }); //get temp variable stored in local storage
                        chrome.tabs.sendMessage(sender.tab.id, { state: "on" }, function(response) {});
                    });
                }
            } else {
                chrome.browserAction.setIcon({ path: "off.png", tabId: sender.tab.id });
            }
        }
    });

chrome.browserAction.onClicked.addListener(function(tab) {
    localStorage["blocked"] = !JSON.parse(localStorage["blocked"]);
    toggle = !JSON.parse(localStorage["blocked"]);
    if (toggle) {
        chrome.browserAction.setIcon({ path: "on.png", tabId: tab.id });
        chrome.storage.sync.get(null, function(items) { //check whitelist
            let f = false;
            for (i in items.whitelist) {
                if (items.whitelist[i].url == tab.url) {
                    f = true;
                    break;
                }
            }
            chrome.storage.local.remove(["inWl", "currentUrl"], function() {}); //remove local storage if any
            chrome.storage.local.set({ 'inWl': f, 'currentUrl': tab.url }, function() {}); //using local storage to store boolean inWl and current url of the tab
            chrome.storage.local.get(null, function(items) { console.log(items); }); //get temp variable stored in local storage
            chrome.tabs.sendMessage(tab.id, { state: "on" }, function(response) { console.log(response); }); //send a message to content script
        });
    } else {
        chrome.browserAction.setIcon({ path: "off.png", tabId: tab.id });
        chrome.tabs.sendMessage(tab.id, { state: "off" }, function(response) { console.log(response); }); //send a message to content script
        chrome.tabs.reload(tab.id);
    }
});