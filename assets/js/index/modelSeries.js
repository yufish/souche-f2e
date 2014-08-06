/**
 * Created by Administrator on 2014/7/21.
 */
define(function() {
    var brand = {};
    var series = {};

    var selectedSeries = {};
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

    modelSeries.init = function(config) {
        var brandUrl = config.brand_api;
        var adviser = config.userRequementJson;
        adviser.brand = adviser.brand || [];
        adviser.series = adviser.series || [];

        for (var index = 0; index < adviser.brand.length; index++) {
            var temp = adviser.brand[index].split(",");
            selectedSeries[temp[1]] = true;
        }
        for (var index = 0; index < adviser.series.length; index++) {
            var temp = adviser.series[index].split(",");
            selectedSeries[temp[0]] = true;
        }

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
                    templateHTML += "<li><span data-id='" + key + "'>" + key + "<\/span>"; //<a>哈弗H6<\/a><a>哈弗H6<\/a><a>哈弗H6<\/a>
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

        // $(".chexi .chexiTitle").html("<h1>全部车系</h1><span data-name=" + name + ">全部</span>");
        $(".chexi .chexiTitle span").attr("code", code);
        if (selectedSeries[code]) {
            $(".chexi .chexiTitle span").addClass("active");
        } else {
            $(".chexi .chexiTitle span").removeClass("active");
        }

        var templateHTML = "";
        for (var key in series[code]) {
            if (series[code].hasOwnProperty(key) && key != "name") {
                templateHTML += "<li>";
                templateHTML += "<h1>" + key + "<\/h1>";
                for (var key1 in series[code][key]) {
                    if (series[code][key].hasOwnProperty(key1)) {
                        if (!selectedSeries[series[code][key][key1].code])
                            templateHTML += "<span code='" + series[code][key][key1].code + "'>" + series[code][key][key1].name + "<\/span>";
                        else {
                            templateHTML += "<span code='" + series[code][key][key1].code + "' class='active'>" + series[code][key][key1].name + "<\/span>";
                        }
                    }
                }
            }
        }
        $(".chexi .chexiContent ul").html(templateHTML);
    }

    modelSeries.addSelectedSeries = function(code) {
        selectedSeries[code] = true;
    }

    modelSeries.deleteSelectedSeries = function(code) {
        delete selectedSeries[code];
        var tabID = $("#carsNav ul li.active").attr("id");
        var brandCode = $("." + tabID + " .brandList ul li a.active").attr("code");
        var name = $("." + tabID + " .brandList ul li a.active").html();

        this.GetSeries(brandCode, name);
    }

    return modelSeries;
});