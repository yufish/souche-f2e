/**
 * 是否加入心愿单的tip
 */
define(function() {
    var config = {}
    var submitData = {}
    var labels = []
    return {
        init: function(_config) {
            config = _config;
            $.ajax({
                url: config.api_showTipUrl,
                dataType: "json",
                success: function(data) {
                    if (data.code == 200 && data.userTags && (data.userTags.brands || data.userTags.maxPrice || data.userTags.minPrice)) {
                        $(".record_warning").removeClass("hidden")
                    }
                    if (data.userTags && data.userTags.brands) {
                        for (var i = 0; i < data.userTags.brands.length; i++) {
                            var item = data.userTags.brands[i];
                            if (submitData[item.parameter]) {

                            } else {
                                submitData[item.parameter] = []
                            }
                            submitData[item.parameter].push(item.code)
                            labels.push("<em>" + item.name + "</em>")

                        }
                        if (data.userTags.maxPrice && data.userTags.minPrice) {
                            labels.push("<em>" + (data.userTags.minPrice / 10000).toFixed(0) + "-" + (data.userTags.maxPrice / 10000).toFixed(0) + "万" + "</em>" + "的车")
                        }
                        $(".record_warning span").html(labels.join("，"))
                    }
                    if (data.userTags && data.userTags.maxPrice) {
                        submitData['maxPrice'] = (data.userTags.maxPrice / 10000).toFixed(0)
                    }
                    if (data.userTags && data.userTags.minPrice) {
                        submitData['minPrice'] = (data.userTags.minPrice / 10000).toFixed(0)
                    }

                }
            });

            $(".record_warning .close").on("click", function(e) {
                e.preventDefault();
                $.ajax({
                    url: config.api_noShowTipUrl,
                    dataType: "json",
                    success: function() {
                        $(".record_warning").addClass("hidden")
                    }
                });
            });
            $(".record_warning .add").on("click", function(e) {
                e.preventDefault();
                var url = config.submit_api + "?tagTip=1&";
                // for (var o in submitData) {
                //     url += o + "=" + submitData[o].join() + "&"
                // }
                var is = ["brands","series","maxPrice","minPrice","minYear","maxYear"]
                var data = {
                    brands:[],
                        series:[],
                    startYear:null,
                    endYear:null,
                    minPrice:null,
                    maxPrice:null
                }

                //合并两处需求到一起
                if (config.userRequirementJsonForTag) {
                    for (var i in data) {
                        var item = config.userRequirementJsonForTag[i];
                        if (item && item.length) {
                            for (var m = 0; m < item.length; m++) {
                                item[m] = item[m].split(",")[0];
                            }
                            if (submitData[i] && submitData[i].join) {
                                data[i] = item.concat(submitData[i])
                            }else{
                                data[i] = item
                            }
                        } else {
                            if (submitData[i]) {
                                data[i] = submitData[i];
                            }else{
                                if(config.userRequirementJsonForTag[i]){
                                    data[i] = config.userRequirementJsonForTag[i]
                                }

                            }
                        }
                    }
                }
//                for (var o in data) {
//                    if (data[o]&&data[o].join) {
//                        url += o + "=" + data[o].join(",") + "&"
//                    } else {
//                        url += o + "=" + data[o] + "&"
//                    }
//
//                }
                Souche.MiniLogin.checkLogin(function(){
                    $.ajax({
                        url: url,
                        data:{
                            brands:data.brands.join(","),
                            series:data.series.join(","),
                            minYear:data.startYear,
                            maxYear:data.endYear,
                            minPrice:data.minPrice,
                            maxPrice:data.maxPrice
                        },
                        dataType: "json",
                        success: function() {
                            window.location.reload();
                        },
                        error: function() {}
                    });
                })


            });
        }
    }
});