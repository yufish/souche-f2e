/**
 * Created by Administrator on 2014/7/16.
 */
define(function()
{
    var config={};
    var adviserModel ={};

    var adviserYear ={};
    var adviserBudget={};
    var adviserInstrest=[];

    adviserModel.adviserYear=adviserYear;
    adviserModel.adviserBudget=adviserBudget;
    adviserModel.adviserInstrest=adviserInstrest;
    adviserModel.adviserYear.modify=false;
    adviserModel.adviserBudget.modify=false;
    adviserModel.adviserInstrest.modify=false;

    var subscribeCallback={};
    var map={
        year:"adviserYear",
        budget:"adviserBudget",
        addInstrest:"addAdviserInstrest",
        deleteInstrest:""
    };

    var publicCallback  = function(name) {
        subscribeCallback[name] = subscribeCallback[name] || [];

        for (var idx = 0, len = subscribeCallback[name].length; idx < len; idx++) {
            subscribeCallback[name][idx].call(this);
        }
    }

    var render = function(name,obj) {
        for (var key in map) {
            if (map.hasOwnProperty(key) && key === name) {
                publicCallback.call(obj, key);
            }
        }
    }

    var result ={};

    result.ModifyAdviserYear = function(year)
    {
        if (adviserYear.minYear == year.min && adviserBudget.maxYear == year.max) {
            return true;
        }
        else {
            adviserYear.minYear = year.min;
            adviserYear.maxYear= year.max;

            render("year",adviserYear);

            return true;
        }
    }

    result.GetAdviserYear = function()
    {
        return adviserYear;
    }

    result.ModifyAdviserBudget = function(budget) {
        if (adviserBudget.minBudget == budget.min && adviserBudget.maxBudget == budget.max) {
            return true;
        }
        else {
            adviserBudget.minBudget = budget.min;
            adviserBudget.maxBudget = budget.max;
            render("budget",adviserBudget);
            return true;
        }
    }

    result.GetAdviserBudget = function()
    {
        return adviserBudget;
    }

    result.AddAdviserInstrest = function(instrest) {
        for (var idx = 0, len = adviserInstrest.length; idx < len; idx++) {
            if (adviserInstrest[idx].seriesCode == instrest.seriesCode) {
                return true;
            }
        }

        adviserInstrest.push(instrest);
        render("addInstrest", instrest);
        return true;
    }

    result.DeleteAdviserInstrest = function(instrest) {
        for (var idx = 0, len = adviserInstrest.length; idx < len; idx++) {
            if ( adviserInstrest[idx].seriesCode == instrest.seriesCode) {
                adviserInstrest.splice(idx, 1);

                render("deleteInstrest",instrest);
                return true;
            }
        }
        return false;
    }

    result.GetAdviserInstrest = function()
    {
        return adviserInstrest;
    }

    result.UpdateAdviserModel = function(callback) {

    }

    result.AddSubscribe = function(name,callback) {
        subscribeCallback[name] = subscribeCallback[name]||[];
        subscribeCallback[name].push(callback);
    }

    result.init = function(_config) {
        config = _config;
        var adviser = config.userRequementJson;

        for (var key in adviser) {
            this.ModifyAdviserBudget({min: adviser.startBudget, max: adviser.endBudget});
            this.ModifyAdviserYear({min: adviser.startYear, max: adviser.endYear});

            for (var index = 0; index < adviser.brand.length; index++) {
                var temp = adviser.brand[index].split(",");
                var instrest = {
                    name: temp[0],
                    seriesCode: temp[1],
                    type: "brand"
                };
                this.AddAdviserInstrest(instrest);
            }
            for (var index = 0; index < adviser.series.length; index++) {
                var temp = adviser.series[index].split(",");
                var instrest = {
                    name: temp[1],
                    seriesCode: temp[0],
                    type: "serie"
                };
                this.AddAdviserInstrest(instrest);
            }
            break;
        }
    }

    return result;
});