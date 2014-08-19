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
                    if (data.code == 200) {
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
                            labels.push(item.name)
                        }
                        $(".record_warning span").html(labels.join("，"))
                    }
                    if (data.userTags && data.userTags.maxPrice) {
                        submitData['maxPrice'] = data.userTags.maxPrice
                    }
                    if (data.userTags && data.userTags.minPrice) {
                        submitData['minPrice'] = data.userTags.minPrice
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
                if (config.userRequirementJsonForTag) {
                    for (var i in submitData) {
                        var item = config.userRequirementJsonForTag[i];
                        if (item && item.length) {
                            for (var m = 0; m < item.length; m++) {
                                item[m] = item[m].split(",")[0];
                            }
                            if (submitData[i] && submitData[i].join) {
                                config.userRequirementJsonForTag[i] = item.concat(submitData[i])
                            }
                            console.log(item)
                        } else {
                            if (submitData[i]) {
                                config.userRequirementJsonForTag[i] = submitData[i];

                            }
                        }
                    }
                }
                for (var o in config.userRequirementJsonForTag) {
                    if (config.userRequirementJsonForTag[o].join) {
                        url += o + "=" + config.userRequirementJsonForTag[o].join(",") + "&"
                    } else {
                        url += o + "=" + config.userRequirementJsonForTag[o] + "&"
                    }

                }
                $.ajax({
                    url: url,
                    dataType: "json",
                    success: function() {
                        window.location.reload();
                    },
                    error: function() {}
                });

            });
        }
    }
});