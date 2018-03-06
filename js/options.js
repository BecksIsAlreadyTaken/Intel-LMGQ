$(function() {
    $('#table').bootstrapTable({
        toolbar: '#toolbar',
        striped: true,
        pagination: true,
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        search: true,
        clickToSelect: true,
        exportDataType: "all",
        columns: [{
                checkbox: true
            },
            {
                field: 'url',
                title: 'url'
            },
        ]
    });
    $('#add-url').click(function() {
        var newUrl = $('#url').val();
        var reg = new RegExp("chrome://");
        var isChromeTag = reg.test(newUrl);
        if (checkUrl(newUrl) == false || isChromeTag == true) {
            alert("please input valid url.");
            $('#url').val('');
        } else {
            checkExist(newUrl);
        }
    });
    $('#save').click(function() {
        var wl = $('#table').bootstrapTable('getData');
        chrome.storage.local.set({
            whitelist: wl
        }, function() {
            alert('Whitelist saved.');
        });
        localStorage.removeItem('current_in_WL');
    });
    $('#remove').click(function() {
        var urls = $.map($('#table').bootstrapTable('getSelections'), function(row) {
            return row.url;
        });
        $('#table').bootstrapTable('remove', {
            field: 'url',
            values: urls
        });
    });
    // $('#import').click(function() {

    // });
    // $('#export').click(function() {

    // });
    localStorage.removeItem('current_in_WL');
});
$(document).ready(restore_whitelist);

function checkUrl(url) {
    var regex = "^((https|http):\/\/)?" +
        "(((([0-9]|1[0-9]{2}|[1-9][0-9]|2[0-4][0-9]|25[0-5])[.]{1}){3}([0-9]|1[0-9]{2}|[1-9][0-9]|2[0-4][0-9]|25[0-5]))" // IP>形式的URL- 199.194.52.184  
        +
        "|" +
        "([0-9a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D-]+[.]{1})+[a-zA-Z-]+)" // DOMAIN（域名）形式的URL  
        +
        "(:[0-9]{1,4})?" // 端口- :80  
        +
        "((/?)|(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?){1}";
    var check = new RegExp(regex);
    return check.test(url);
}

function checkExist(_url) {
    chrome.storage.local.get({
        whitelist: []
    }, function(items) {
        var flag;
        for (i in items.whitelist) {
            if (items.whitelist[i].url == _url) {
                var f = true;
                flag = f;
                break;
            }
        }
        if (flag) alert('please input a new Url.');
        else {
            var data = [];
            data.push({
                url: _url
            });
            $('#url').val('');
            $('#table').bootstrapTable('append', data);
        }
    });
}

function restore_whitelist() {
    chrome.storage.local.get({
        whitelist: []
    }, function(items) {
        $('#table').bootstrapTable('append', items.whitelist);
    });
}