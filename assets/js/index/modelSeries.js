/**
 * Created by Administrator on 2014/7/21.
 */
define(function() {
    var brand = {};
    var series = {};

    var modelSeries = {};

    var groupBy = function(array, predicate, context) {
        var result = {};

        for (var index = 0, len = array.length; index < len; index++) {
            var key = predicate.call(context || window, array[index]);
            if (result[key]) {
                result[key].push(array[index]);
            } else {
                result[key] = [array[index]];
            }

        }
        return result;
    }

    modelSeries.init = function() {
        var brandUrl = config.brand_api;

        $.ajax({
            url: brandUrl,
            dataType: "json"
        }).done(function(result) {
            var brand = groupBy(result.items, function(value) {
                return value.name.split(" ")[0];
            });
            var templateHTML = "";

            for (var key in brand) {
                if (brand.hasOwnProperty(key)) {
                    templateHTML += "<li><span>" + key + "<\/span>"; //<a>哈弗H6<\/a><a>哈弗H6<\/a><a>哈弗H6<\/a>
                    for (var key1 in brand[key]) {
                        if (brand[key].hasOwnProperty(key1)) {
                            templateHTML += "<a code='" + brand[key][key1].code + "'>" + brand[key][key1].enName + "<\/a>";
                        }
                    }
                    templateHTML += "<\/li>";
                }
            }

            $(".addInstrestCarContent .brandList ul").html(templateHTML);
        });
    }

    modelSeries.GetSeries = function(brandCode, name) {
        var seriesUrl = config.series_api + brandCode;
        if (series[brandCode]) {
            this.SetSeries(brandCode, name, series[brandCode]);
        } else {
            var context = this;

            $.ajax({
                url: seriesUrl,
                dataType: "json",
                context: context
            }).done(function(result) {
                this.SetSeries(brandCode, name, result);
            });
        }
    }

    modelSeries.SetSeries = function(code, name, seriesList) {
        if (series[code]) {

        } else {
            series[code] = seriesList.codes;
            series[code].name = name;
        }

        $(".chexi .chexiTitle").html(name + "全部车系");
        $(".chexi .chexiTitle").attr("code", code);
        var templateHTML = "";
        for (var key in series[code]) {
            if (series[code].hasOwnProperty(key) && key != "name") {
                templateHTML += "<li>";
                templateHTML += "<h1>" + key + "<\/h1>";
                for (var key1 in series[code][key]) {
                    if (series[code][key].hasOwnProperty(key1)) {
                        templateHTML += "<span code='" + series[code][key][key1].code + "'>" + series[code][key][key1].name + "<\/span>";
                    }
                }
            }
        }
        $(".chexi .chexiContent ul").html(templateHTML);
    }


    return modelSeries;
});