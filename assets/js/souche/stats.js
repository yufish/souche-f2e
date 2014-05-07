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

    $(document).on("click", function(e) {
        var data = {
            page_x: e.pageX - ($(window).width() / 2 - 595),
            page_y: e.pageY,
            element_id: e.target.id || "",
            page_url: window.location.href.replace(/\?.*?$/, ""),
            refer_url: document.referrer,
            user_agent: navigator.userAgent,
            user_screenwidth: screen.width,
            user_screenheight: screen.height,
            user_viewwidth: $(window).width(),
            user_viewheight: $(window).height(),
            cookie: document.cookie
        }
        var param = ""
        for (var d in data) {
            param += d + "=" + data[d] + "&"
        }
        new Image().src = "http://f2e-monitor.souche.com/performance/click?" + param
    })
});