var toggle = true;
chrome.browserAction.onClicked.addListener(function(tab) {
    toggle = !toggle;
    if (toggle) {
        chrome.browserAction.setIcon({ path: "on.png", tabId: tab.id });
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
                chrome.storage.local.remove(["inWl", "currentUrl"], function() {}); //remove local storage if any
                chrome.storage.local.set({ 'inWl': f, 'currentUrl': url }, function() {}); //using local storage to store boolean inWl and current url of the tab
                chrome.storage.local.get(null, function(items) {console.log(items);}); //get temp variable stored in local storage
                chrome.tabs.sendMessage(tabs[0].id, { state: "on" }, function(response) {console.log(response);}); //send a message to content script
            });
        });
    } else {
        chrome.browserAction.setIcon({ path: "off.png", tabId: tab.id });
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { state: "off" }, function(response) { console.log(response);}); //send a message to content script
        });
    }
});

// chrome.tabs.executeScript(tab.id, { file: "toggleon.js" });
// chrome.tabs.executeScript(tab.id, { code: "console.log('off');" });