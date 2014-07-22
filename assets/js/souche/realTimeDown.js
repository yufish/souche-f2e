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
        var list=[]
        for(var index=0;index<3;index++) {
            list.push(Math.random().toString());
        }

        var downList = "<div class='realTimeDown'>";
        for (var index = 0, len = list.length; index < len; index++) {
            if(index%2) {
                downList += "<span>" + list[index] + "<\/span>";
            }
            else
            {
                downList += "<span>" + list[index]+"<a>进入车系»</a>" + "<\/span>";
            }
        }
        downList+="<\/div>";
        $(".realTimeDown").remove();
        var element = $(downList).css(
            {
                top:top+2,
                left:left,
                width:downWidth
            }
        );

        $("body").append(element);
    }

    var init = function ($element, option,downHeight) {
        downWidth = $element.width();
        maxDownHeight = downHeight;
        top = $element.offset().top + $element.height();
        left = $element.offset().left;


        ajaxOption.url = option.url;
        ajaxOption.data = option.data || {};
        ajaxOption.dataType = option.dataType;
        ajaxOption.type = option.type;

        afterShow = option.success;

        $element.find("input").keyup(function () {
            ajaxOption.url += "?words=" + $(this).val();
            Souche.DelayAjax.addAjax(ajaxOption, callback, 300, true, true);
        });
    }
    down.init = init;
    return  down;
});