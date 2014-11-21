/**
 * 带有缓存的品牌和车系等得请求方法
 * @param  {[type]} DB [description]
 * @return {[type]}    [description]
 */
define(['souche/util/sc-db'], function(DB) {
    var BRAND_KEY = "BRAND_CACHE_KEY";
    var SERIES_KEY = "SERIES_CACHE_KEY";
    var PROVINCE_KEY = "PROVINCE_CACHE_KEY"
    var CITY_KEY = "CITY_CACHE_KEY"
    var db = new DB("LOADINFO")
    return {
        loadBrands: function(callback) {
            var data = null;
//            try {
//                data = db.get(BRAND_KEY);
//            } catch (e) {
//
//            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevel.json",
                    dataType: "json",
                    data: {
                        type: "car-subdivision"
                    },
                    success: function(data) {
//                        db.set(BRAND_KEY, data);
                        callback(data);

                    },
                    error: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    }
                });
//            }

        },
        loadSeries: function(brandid, callback) {
            var data = null;
//            try {
//                data = db.get(SERIES_KEY + brandid);
//            } catch (e) {
//
//            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                    dataType: "json",
                    data: {
                        type: "car-subdivision",
                        code: brandid
                    },
                    success: function(data) {
//                        db.set(SERIES_KEY + brandid, data);
                        callback(data)
                    },
                    error: function() {
                        // alert("车系信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("车系信息请求出错，刷新后再试")
                    }
                });
//            }
        },
        loadProvince: function(callback) {
            var data = null;
            try {
                data = db.get(PROVINCE_KEY);
            } catch (e) {

            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevel.json?type=area",
                    dataType: "json",
                    data: {
                        type: "area"
                    },
                    success: function(data) {
                        db.set(PROVINCE_KEY, data);
                        callback(data);

                    },
                    error: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    }
                });
//            }
        },
        loadCity: function(provinceCode, callback) {
            var data = null;
            try {
                data = db.get(CITY_KEY);
            } catch (e) {

            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadNextLevel.json?request_message={\"code\":\"" + provinceCode + "\",\"type\":\"area\"}",
                    dataType: "json",
                    data: {

                    },
                    success: function(data) {
                        db.set(CITY_KEY, data);
                        callback(data);

                    },
                    error: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    }
                });
//            }
        },
        loadCounty: function(cityCode, callback) {
            var data = null;
            try {
                data = db.get(CITY_KEY);
            } catch (e) {

            }
//            if (data) {
//                callback(data);
//            } else {
            $.ajax({
                url: contextPath + "/pages/dicAction/loadNextLevel.json?request_message={\"code\":\"" + cityCode + "\",\"type\":\"area\",\"level\":\"city\"}",
                dataType: "json",
                data: {

                },
                success: function(data) {
                    db.set(CITY_KEY, data);
                    callback(data);

                },
                error: function() {
                    // alert("品牌信息请求出错，刷新后再试")
                },
                failure: function() {
                    // alert("品牌信息请求出错，刷新后再试")
                }
            });
//            }
        }
    }
});