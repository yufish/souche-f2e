define(['souche/util/sc-db'], function(DB) {
    var BRAND_KEY = "BRAND_CACHE_KEY";
    var SERIES_KEY = "SERIES_CACHE_KEY";
    var db = new DB("LOADINFO")
    return {
        loadBrands: function(callback) {
            var data = null;
            try {
                data = db.get(BRAND_KEY);
            } catch (e) {

            }
            if (data) {
                callback(data);
            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevel.json",
                    dataType: "json",
                    data: {
                        type: "car-subdivision"
                    },
                    success: function(data) {
                        db.set(BRAND_KEY, data);
                        callback(data);

                    },
                    error: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    }
                });
            }

        },
        loadSeries: function(brandid, callback) {
            var data = null;
            try {
                data = db.get(SERIES_KEY + brandid);
            } catch (e) {

            }
            if (data) {
                callback(data);
            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                    dataType: "json",
                    data: {
                        type: "car-subdivision",
                        code: brandid
                    },
                    success: function(data) {
                        db.set(SERIES_KEY + brandid, data);
                        callback(data)
                    },
                    error: function() {
                        // alert("车系信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("车系信息请求出错，刷新后再试")
                    }
                });
            }
        }
    }
});