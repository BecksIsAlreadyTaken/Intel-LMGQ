function getImgUrl() {
    var img = document.getElementsByTagName('img');
    img.className = 'test';
    var reg = new RegExp("data:image/");
    for (var i = 0; i < img.length; i++) {
        if (reg.test(img[i].src)) {
            img[i].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAITSURBVGiB7dnLatRQHMfxT0WslwqKOq2XFxDBjdiNouBGcCEufA+X7irW21u48A0EQXwC8QKl2iptFcSNiOi6ohIXOXHizCTNdGY6Bz1fOCRzyDn5fUn+czIZEonEf8EEsnGHGAbbxh1gWGwv7U+MLcVgZPxDVySJxEYSiY2YRHbjBtbwDauYw66mE2TGvyjuwbNSlnJ7Kpes4k/+GETmQ4Z3OIf9Yfs+9M/VjI1KpAh8vqP/Quhfqxkblcj3kGGqo39v6F+vGZsh66fYWzjZV7zmfAzbUx39p8P2Q5NJmlyRFl5jGZMNw/XDTe0aOYMdOGvINdLCUum4e4Om7sHIv7WmtSVW8RM/MDt49i7K68gvzdeRDUWOhskyPMc+3AqfVxqcYKuoFZmW10Mmr41W6N9Z6r9bMfEoaqiOSpGyxJK2RMGs9i12CVdwG0/wtWLMKOkpckz7dnohv516Ma93YRZtBUdGFLyTLpEZvAn7y/IrU8VkOOYzHuMOrsrXgWKORRwcTfa/6BJpKlFQVQszeBvmWsCBQZNuQJdIPxIbcVhbpqot4PgQztUl8lL+1DksDuGVepl1XDfY76KeNbJVTOF+6dwPbb6eonj6vYhP4fxfcHkTc0QhQr7mPCrleCB/9mpKNCLkbzmvyWumrqbqWhQiBSfk60/fIuW38endbwwkkdhIIrGRRGIj/aubSCQSY+E3Kinuik6WqioAAAAASUVORK5CYII=";
        }
    }
    // console.log(document.images.length); // img num
}

function getIframeImgUrl() {

}

function getBgImgUrl() {

}

function getDataSrc() {

}

function blockNsfwImgs() {
    //console.log("nsfw");
}

function connectToServer() {}

function Normal() {
    console.log("off");
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        // embeded image process 
        if (request.base64 == "on") {
            getImgUrl();
        }
    });