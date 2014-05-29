if (!window.contextPath) {
    contextPath = "";
}
var f2e_begin_load_time = new Date().getTime();
var f2e_first_load_time = 0;
var f2e_all_load_time = 0;
var f2e_traffic_id = 0;
var f2e_click_count = 0;
var f2e_scroll_max = 0;

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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
$(document).ready(function() {
    f2e_first_load_time = new Date().getTime();
    viewPageStat(document.location.href);
    //加载点击数据
    if (getQueryString("load_data")) {
        var click_types = {};
        var url = "http://f2e-monitor.souche.com/performance/click-data?url=" + window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com")
        if (getQueryString("time")) {
            url += "&time" + getQueryString("time")
        }
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function(data) {
                data.forEach(function(click) {
                    if (click.element_id) {
                        if (click_types[click.element_id]) {
                            click_types[click.element_id] += 1;
                        } else {
                            click_types[click.element_id] = 1;
                        }
                    }
                })
                for (var i in click_types) {
                    var ele = $("*[click_type='" + i + "']");
                    var offset = ele.offset();
                    $("<div style=''></div>").appendTo(document.body).css({
                        position: "absolute",
                        top: offset.top,
                        left: offset.left,
                        background: "#111",
                        color: "#fff",
                        padding: "0px 5px",
                        fontSize: 12,
                        opacity: 0.6,
                        zIndex: 1000000000
                    }).html(click_types[i])
                }
                console.log(click_types)
            }

        });
    }
    $('body').on('click', 'a,[type=submit]', function() {
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
        f2e_click_count++;
        var data = {
            page_x: e.pageX - ($(window).width() / 2 - 595),
            page_y: e.pageY,
            element_id: $(e.target).attr("click_type") || "",
            page_url: window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com"),
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
    $(window).scroll(function() {
        var top = $(window).scrollTop();
        if (top > f2e_scroll_max) {
            f2e_scroll_max = top;
        }
    })

});
var setTrafficId = function(_id) {
    f2e_traffic_id = _id;
}
$(window).load(function() {
    f2e_all_load_time = new Date().getTime();
    var data = {
        url: window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com"),
        referrer: document.referrer,
        load_first_time: f2e_first_load_time - f2e_begin_load_time,
        load_all_time: f2e_all_load_time - f2e_begin_load_time,
        cookie: document.cookie
    }
    var param = ""
    for (var d in data) {
        param += d + "=" + data[d] + "&"
    }

    var script = document.createElement("script");
    script.src = "http://f2e-monitor.souche.com/performance/traffic_begin?callback=setTrafficId&" + param;
    document.body.appendChild(script);
})

window.onbeforeunload = function() {
    var data = {
        _id: f2e_traffic_id,
        stay_second: new Date().getTime() - f2e_first_load_time,
        click_count: f2e_click_count,
        visit_length: f2e_scroll_max
    }
    var param = ""
    for (var d in data) {
        param += d + "=" + data[d] + "&"
    }
    new Image().src = "http://f2e-monitor.souche.com/performance/traffic_end?" + param
}