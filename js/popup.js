function toggleOn() {
    console.log('toggleon');
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { state: "on" }, function(response) {
            console.log('getresp');
            $('whiteliststate').html('InWhiteList: ' + response.inWhiteList);
        });
    });
}

function checkState() {
    var mytoggle = document.getElementById('mytoggle');
    if (mytoggle.checked == true) toggleOn();
}

$(function() {
    $('#mytoggle').bootstrapToggle();
    $('#mytoggle').change(function() {
        console.log('change');
        console.log(document.getElementById('mytoggle').checked);
        checkState();
    })
})