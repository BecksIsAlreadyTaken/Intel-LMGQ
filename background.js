function getImgUrl() {
    var img = document.getElementsByTagName('img');
    img.className = 'test';
    var src = "";
    for (var i = 0; i < img.length; i++) {
        src += img[i].src;
        src += "\n";
    }
    console.log(src);
    console.log(document.images.length);
}
