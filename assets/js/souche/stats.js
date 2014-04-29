if (!window.contextPath) {
    contextPath = "";
}

function viewPageStat(url) {
    $.ajax({
        url: contextPath + '/stats/click_stat',
        type: 'POST',
        data: {
            "url": document.location.href,
            "refer_url": document.referrer,
            "type": "pageview"
        },
        dataType: 'json',
        timeout: 5000
    });
}

$(document).ready(function() {
    viewPageStat(document.location.href);
    $("a, [type=submit]").bind('click', function() {
        var href = $(this).attr("href");
        var clickType = $(this).attr("click_type");
        if (!clickType) {
            clickType = $(this).closest("[click_type]").attr("click_type");
        }
        var ref_url = document.location.href;
        $.ajax({
            url: contextPath + '/stats/click_stat',
            type: 'POST',
            data: {
                "click_url": href,
                "refer_url": ref_url,
                "type": "pageclick",
                "click_type": clickType
            },
            dataType: 'json',
            timeout: 5000,
            error: function(XMLHttpRequest, textStatus, errorThrown) {},
            success: function(data) {}
        });
    });
});