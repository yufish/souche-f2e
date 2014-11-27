if (!window.contextPath) {
    contextPath = "";
}
var f2e_begin_load_time = new Date().getTime();
var f2e_first_load_time = 0;
var f2e_all_load_time = 0;
var f2e_traffic_id = 0;
var f2e_click_count = 0;
var f2e_scroll_max = 0;
var Souche = Souche||{};

Souche.stats = {
    add_click:function(click_type){
        var data = {
            element_id: click_type || "",
            page_url: window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com").replace("souche.com/index.html", "souche.com").replace(/\/$/, ""),
            cookie: document.cookie
        }
        if (ABtest && ABtest.id) {
            data.abtest = ABtest.id;
        }
        var param = ""
        for (var d in data) {
            param += d + "=" + data[d] + "&"
        }
        new Image().src = "http://f2e-monitor.souche.com/performance/click?" + param
    }
};
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

//    if (window.location.host.indexOf("souche.com") == -1) {
//        return;
//    }
    f2e_first_load_time = new Date().getTime();
    viewPageStat(document.location.href);
    //加载点击数据
    if (getQueryString("load_data")) {
        var click_types = {};
        var url = "http://f2e-monitor.souche.com/performance/click-data?url=" + window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com").replace("souche.com/index.html", "souche.com").replace(/\/$/, "")
        if (getQueryString("time")) {
            url += "&time=" + getQueryString("time")
        }
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function(click_types) {
                // data.forEach(function(click) {
                //     if (click.element_id) {
                //         if (click_types[click.element_id]) {
                //             click_types[click.element_id] += 1;
                //         } else {
                //             click_types[click.element_id] = 1;
                //         }
                //     }
                // })
                for (var i in click_types) {
                    var ele = $("*[click_type='" + i + "']");
                    var count;
                    var title = "";
                    if (click_types[i] && click_types[i].count) {
                        count = click_types[i].count;
                        for (var t in click_types[i]) {
                            title += t + "：" + click_types[i][t] + "\n"
                        }
                    } else {
                        count = click_types[i];
                    }
                    var offset = ele.offset();
                    if (offset) {
                        $("<div style=''></div>").appendTo(document.body).css({
                            position: "absolute",
                            top: offset.top,
                            left: offset.left,
                            background: "#111",
                            color: "#fff",
                            padding: "0px 5px",
                            fontSize: 12,
                            opacity: 1,
                            zIndex: 1000000000
                        }).html(count).attr("for_click_type", i).attr("title", title)
                    }

                }
                setInterval(function() {
                    for (var i in click_types) {
                        var ele = $("*[click_type='" + i + "']");
                        var offset = ele.offset();
                        if (offset) {
                            $("div[for_click_type='" + i + "']").animate({
                                top: offset.top,
                                left: offset.left
                            })
                        }

                    }
                }, 1000)
            }

        });
    }
//    $('body').on('click', 'a,[type=submit]', function() {
//        var href = $(this).attr("href");
//        var clickType = $(this).attr("click_type");
//        if (!clickType) {
//            clickType = $(this).closest("[click_type]").attr("click_type");
//        }
//        var ref_url = document.location.href;
//        $.ajax({
//            url: contextPath + '/stats/click_stat',
//            type: 'POST',
//            data: {
//                "click_url": href,
//                "refer_url": ref_url,
//                "type": "pageclick",
//                "click_type": clickType
//            },
//            dataType: 'json',
//            timeout: 5000,
//            error: function(XMLHttpRequest, textStatus, errorThrown) {},
//            success: function(data) {}
//        });
//    });
    var eventKey = "mousedown";
    try {
        if ("ontouchstart" in window) {
            eventKey = "touchstart";
            var touchestart_scrollTop = 0;
            $(document.body).on(eventKey, function(e) {
                touchestart_scrollTop = $(window).scrollTop()
            }).on("touchend",function(e){
                var movedistance = $(window).scrollTop()-touchestart_scrollTop;
                if(movedistance>2||movedistance<-2){
                    return;
                }
                f2e_click_count++;
                var clickType = $(e.target).attr("click_type");
                if (!clickType) {
                    clickType = $(e.target).closest("[click_type]").attr("click_type");
                }
                var data = {
                    page_x: e.pageX - ($(window).width() / 2 - 595),
                    page_y: e.pageY,
                    element_id: clickType || "",
                    page_url: window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com").replace("souche.com/index.html", "souche.com").replace(/\/$/, ""),
                    refer_url: document.referrer,
                    user_agent: navigator.userAgent,
                    user_screenwidth: screen.width,
                    user_screenheight: screen.height,
                    user_viewwidth: $(window).width(),
                    user_viewheight: $(window).height(),
                    cookie: document.cookie
                }
                if (ABtest && ABtest.id) {
                    data.abtest = ABtest.id;
                }
                var param = ""
                for (var d in data) {
                    param += d + "=" + data[d] + "&"
                }
                new Image().src = "http://f2e-monitor.souche.com/performance/click?" + param
            })
        }else{
            $(document.body).on("click",function(e){
                f2e_click_count++;
                var clickType = $(e.target).attr("click_type");
                if (!clickType) {
                    clickType = $(e.target).closest("[click_type]").attr("click_type");
                }
                var data = {
                    page_x: e.pageX - ($(window).width() / 2 - 595),
                    page_y: e.pageY,
                    element_id: clickType || "",
                    page_url: window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com").replace("souche.com/index.html", "souche.com").replace(/\/$/, ""),
                    refer_url: document.referrer,
                    user_agent: navigator.userAgent,
                    user_screenwidth: screen.width,
                    user_screenheight: screen.height,
                    user_viewwidth: $(window).width(),
                    user_viewheight: $(window).height(),
                    cookie: document.cookie
                }
                if (ABtest && ABtest.id) {
                    data.abtest = ABtest.id;
                }
                var param = ""
                for (var d in data) {
                    param += d + "=" + data[d] + "&"
                }
                new Image().src = "http://f2e-monitor.souche.com/performance/click?" + param
            })
        }
    } catch (e) {

    }

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
    if (window.location.host.indexOf("souche.com") == -1) {
        return;
    }
    f2e_all_load_time = new Date().getTime();

    var data = {
        url: window.location.href.replace(/[?;].*?$/, "").replace("http://souche.com", "http://www.souche.com").replace("souche.com/index.html", "souche.com").replace(/\/$/, ""),
        referrer: document.referrer,
        load_first_time: f2e_first_load_time - f2e_begin_load_time,
        load_all_time: f2e_all_load_time - f2e_begin_load_time
    }
    var phone_match = document.cookie.match(/noregisteruser=([0-9]*?);/);
    if (phone_match) {
        data.phone = phone_match[1];
    }
    var tag_match = document.cookie.match(/usertag=([0-9a-zA-Z_-]*?)(;|$)/);
    if (tag_match) {
        data.userTag = tag_match[1];
    } else {
        //获取不到userTag，把环境信息存到后台
        $.ajax({
            url: "/pages/evaluateAction/noUserTagTrace.json",
            data: {
                cookie: document.cookie,
                url: window.location.href,
                referrer: document.referrer,
                user_agent: navigator.userAgent,
                user_screenwidth: screen.width,
                user_screenheight: screen.height,
                user_viewwidth: $(window).width(),
                user_viewheight: $(window).height()
            },
            type: "post"
        })
    }
    if (ABtest && ABtest.id) {
        data.abtest = ABtest.id;
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
    if (window.location.host.indexOf("souche.com") == -1) {
        return;
    }
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


var ABtest = {
    id: "",
    use: function(id) {
        this.id = id;
    }
}