$('#time').dateRangePicker();
$("#filter-form").on("submit", function(e) {
    e.preventDefault();
    window.location.href = "?url=" + encodeURIComponent($("#select").val()) + "&time=" + $("#time").val()
})

if (url == "http://www.souche.com/pages/choosecarpage/choose-car-detail.html") {
    $(".refer-page").attr("src", url + "?carId=qU6uBbS")
}
if (url == "http://www.souche.com/pages/mobile/detail.html") {
    $(".refer-page").attr("src", url + "??carId=2kauoc5")
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
    }
});
// $.ajax({
//     url: "/performance/draw_data",
//     dataType: "json",
//     data: {
//         url: encodeURIComponent(url),
//         time: time
//     },
//     success: function(data) {
//         alert(data)
//         globalData = data;
//         // $('.jcrop-container').Jcrop({
//         //     bgColor: 'black',
//         //     onSelect: function(_d) {
//         //         var count = 0;

//         //         globalData.forEach(function(d) {
//         //             if (inIn(_d, d)) {
//         //                 count++;
//         //             }
//         //         })
//         //         $("<div class='area-p'></div>").appendTo($(".con")).css({
//         //             left: _d.x,
//         //             top: _d.y,
//         //             width: _d.w,
//         //             height: _d.h
//         //         }).html(count + "<br/>" + (count * 100 / globalData.length).toFixed(2) + "%")
//         //     }
//         // });
//         $(".loading").css("display", "none");
//         var hdata = []
//         data.forEach(function(d) {
//             hdata.push({
//                 x: d.page_x,
//                 y: d.page_y,
//                 count: 1
//             })
//         })
//         var config = {
//             element: document.getElementById("map"),
//             radius: 10,
//             opacity: 50
//         };

//         //creates and initializes the heatmap
//         var heatmap = h337.create(config);

//         // let's get some data
//         var data = {
//             max: 70,
//             data: hdata
//         };

//         heatmap.store.setDataSet(data);
//         loadingTip.hide()
//     }
// });


$("#show-map").click(function() {
    if (!this.checked) {
        $(".map").addClass("hidden")
    } else {
        $(".map").removeClass("hidden")
    }
})