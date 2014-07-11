/**
 * Created by Administrator on 2014/7/11.
 */
define(function() {
    var down = {};
    var ajaxOption = {};
    var afterShow = undefined;
    var downWidth;
    var maxDownHeight;
    var top,lef;

    var _bind = function () {

    }

    var callback = function (result) {
        var list = result.content || ["111","4444","555"];
        var downList = "<ul>";
        for (var index = 0, len = list.length; index < len; index++) {
            downList += "<li><span>" + list[index] + "<\/span><\/li>";
        }
        downList+="<\/ul>";
        console.log(1);
        $("body").append(downList);
    }

    var init = function ($element, option,downHeight) {
        downWidth = $element.width();
        maxDownHeight = downHeight;
        top = $element.offset().top + $element.height();
        left = $element.offset().left;


        ajaxOption.url = option.url;
        ajaxOption.data = option.data||{};
        ajaxOption.dataType = option.dataType;
        ajaxOption.type = option.type;

        afterShow = option.success;

        $element.find("input").keyup(function () {
            Souche.DelayAjax.addAjax(ajaxOption, callback, 500, true, true);
        });
    }
    down.init = init;
    return  down;
});