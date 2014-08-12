/**
 * 是否加入心愿单的tip
 */
define(function() {
    var config = {}
    var submitData = {}
    return {
        init: function(_config) {
            config = _config;
            $.ajax({
                url: config.api_showTipUrl,
                success: function(data) {
                    if (data.code == 200) {
                        $(".record_warning").removeClass("hidden")
                    }
                    if (data.brands) {
                        for (var i = 0; i < data.brands.length; i++) {
                            var item = data.brands[i];
                            if (submitData[item.parameter]) {

                            } else {
                                submitData[item.parameter] = []
                            }
                            submitData[item.parameter].push(item.code)
                        }
                    }
                }
            });

            $(".record_warning .close").on("click", function(e) {
                e.preventDefault();
                $.ajax({
                    url: config.api_noShowTipUrl,
                    success: function() {
                        $(".record_warning").addClass("hidden")
                    }
                });
            });
            $(".record_warning .add").on("click", function(e) {
                e.preventDefault();
                var url = config.submit_api;
                for (var o in submitData) {
                    url += "&" + o + "=" + submitData[o].join()
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