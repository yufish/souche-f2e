$('#time').dateRangePicker();
$("#filter-form").on("submit", function(e) {
    e.preventDefault();
    window.location.href = "?url=" + encodeURIComponent($("#select").val()) + "&time=" + $("#time").val()
})

if (url == "http://www.souche.com/pages/choosecarpage/choose-car-detail.html") {
    $(".refer-page").attr("src", url + "?carId=qU6uBbS&load_data=1&amp;time=" + time)
}
if (url == "http://www.souche.com/pages/mobile/detail.html") {
    $(".refer-page").attr("src", url + "?carId=2kauoc5&load_data=1&amp;time=" + time)
}
// loadingTip.show("正在加载中，请稍后")
var inIn = function(data, d) {
    if (d.page_x > data.x && d.page_x < data.x2 && d.page_y > data.y && d.page_y < data.y2) {
        return true;
    }
    return false;
}
var globalData = [];

$.ajax({
    url: "/performance/traffic-data",
    dataType: "json",
    data: {
        url: encodeURIComponent(url),
        time: time
    },
    success: function(data) {
        $("#pv_count").html(data.pv);
        $("#uv_count").html(data.uv);
        var html = ""
        for (var i in data) {
            if(typeof(data[i])=='object'){
                for(var n in data[i]){
                    html += "<span style='margin-right:10px;'>" + (n + "=" + data[i][n]) + "</span>"
                }
            }else{
                html += "<span style='margin-right:10px;'>" + (i + "=" + data[i]) + "</span>"
            }

        }
        $("#traffic_data").html(html)
    }
});


$("#show-map").click(function() {
    if (!this.checked) {
        $(".map").addClass("hidden")
    } else {
        $(".map").removeClass("hidden")
    }
})