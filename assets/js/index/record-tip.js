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
                if (userRequirementJsonForTag) {
                    for (var i in userRequirementJsonForTag) {
                        var item = userRequirementJsonForTag[i];
                        if (item.length) {
                            for (var m = 0; m < item.length; m++) {
                                item[m] = item[m].split(",")[0];
                            }
                            if (submitData[i].length) {
                                item = item.concat(submitData[i])
                            }
                        } else {
                            if (submitData[i]) {
                                userRequirementJsonForTag[i] = submitData[i];
                            }
                        }
                    }
                }
                for (var o in userRequirementJsonForTag) {
                    url += o + "=" + userRequirementJsonForTag[o].join(",") + "&"
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