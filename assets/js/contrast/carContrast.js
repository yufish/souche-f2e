/**
 * Created by Administrator on 2014/6/10.
 */
define(function() {
    var carContrast = {};
    var config = {
    };
    var ele ={

    };

    var carCount =4;

    var showScroll_x =false;
    var contentTemplate="<th width='200px' class='title carname'><a><\/a><i class='close-contrast hidden'><\/i><span class='more-detail'><\/span><\/th>" +
                          "<td class='pic'><\/td><td class='price-s'><\/td><td class='price-n'><\/td>" +
                          "<td class='price-v'><\/td><td><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td>" +
        "<td width='220px'><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td>";

    var _bind = function () {
        $(".close-contrast").live("click", function (event) {
            var headTh = $(this).parent();
            var headThIndex = headTh.index();

            headTh.deleteContent = deleteContent;

            $.ajax({
                type: "GET",
                url: config.api_deleteContrast + "?cid=" + $(this).attr("cid"),
                dataType: "json",
                context: headTh
            }).done(function (data) {
                this.deleteContent(this.index());
                delete headTh.deleteContent;
            });

            event.stopPropagation();
            return false;
        });

        var hasTouch = false;
        var startX;
        var startY;
        var cloneElement;
        var cellWidth = $(".carname").width();
        var cellHeight = $(".carname").height();
        var moveRangeStartX = $(".carname").offset().left;
        var carBoundLeftX = moveRangeStartX;
        var moveRangeEndX = $(".car-title").offset().left + $(".car-title").width();
        var moveRangeStartY = $(".carname").offset().top;
        var moveRangeEndY = $(".carname").offset().top + $(".carname").height();
        var contentPixList , movePosition, defaultPosition;

        $(document).live("mousedown",function(event)
        {
            event.preventDefault();
        });

        $(".more-detail").live("mousedown", function (event) {
            startX = event.pageX;
            startY = event.pageY;
            hasTouch = true;

            cloneElement = $(this).parent().clone();
            cloneElement.css({
                opacity: 0.8,
                position: 'absolute',
                cursor: 'pointer',
                top: event.pageY - 20 + 'px',
                left: event.pageX - 100 + 'px',
            });
            document.body.appendChild(cloneElement[0]);

            document.body.onselectstart = document.body.ondrag = function () {
                return false;
            }

            contentPixList=[];
            for (var index = 0; index <= carCount; index++) {
                contentPixList.push(moveRangeStartX + index * cellWidth - $(document).scrollLeft());
            }

            for (var index = 0; index < contentPixList.length; index++) {
                if ((event.pageX) < contentPixList[index] + cellWidth && (event.pageX) > contentPixList[index]) {
                    if (movePosition !== index) {
                        movePosition = defaultPosition = index;
                    }
                }
            }
        });

        $(document).mousemove(function (event) {
            if (hasTouch) {
                y = event.pageY;
                x = event.pageX;
                //console.log(x);
                //console.log(moveRangeEndX);
                //console.log(moveRangeStartX);
                if ((x) < moveRangeEndX && (x) > moveRangeStartX && y > moveRangeStartY && y < moveRangeEndY) {
                  //  console.log("yidong");
                    cloneElement.css({
                        top: y - 20 + 'px',
                        left: x - 100 + 'px'
                    });

                    for (var index = 0; index < contentPixList.length; index++) {
                        if ((x) < contentPixList[index] + cellWidth && (x) > contentPixList[index]) {

                            if (movePosition != index && (index != defaultPosition - 1) && index <= carCount) {
                                movePosition = index;
                                //console.log("当年呈现:"+movePosition);
                               // console.log("移到:"+index);
                                //console.log("原来位置:"+defaultPosition);
                                $(".tempalte").remove();
                                if (movePosition !== defaultPosition) {
                                    addNewContent($(contentTemplate), movePosition, true);
                                }
                            }
                        }
                    }
                }
            }
        });

        $(document).mouseup(function () {
            if (hasTouch) {
                cloneElement.remove();
                hasTouch = false;
                if ($(".tempalte").length != 0) {
                    $(".tempalte").remove();
                    document.body.onselectstart = document.body.ondrag = null;
                    //alert(movePosition);
                    //alert(defaultPosition);
                    var carList = $(".carname");
                    var carListLength = carList.length;
                    var sortString="";

                    var self = this;
                    self.getContentList = getContentList;
                    self.addNewContent = addNewContent;
                    self.defaultPosition = defaultPosition;
                    self.movePosition = movePosition;
                    var moveItemList = this.getContentList(self.defaultPosition);

                    delete self.getContentList;
                    delete self.addNewContent;
                    delete self.defaultPosition;
                    delete self.movePosition;

                    addNewContent(moveItemList, movePosition, false);

                    for(var index=0;index<carListLength;index++) {
                        sortString+=$(".carname").eq(index).find(".close-contrast").attr("cid")+","
                    }

                    sortString=sortString.substr(0,sortString.length-1);

                    $.ajax({
                        type: "GET",
                        url: config.api_updateContrastSeq+"?ids="+sortString,
                        dataType: "json",
                        context: self
                    }).done(function (data) {

                    });

                }
            }
        });

        $(".contrast-title input").change(function()
        {
            var optimal,repeat;
            var repeat = $(".contrast-title input")[0].checked.toString();
            var optimal = $(".contrast-title input")[1].checked.toString();

            $.ajax({
                url:config.api_contrastUrl+"?repeat="+repeat+"&optimal="+optimal,
                type:"GET"
            });
        });

        // 鼠标滑轮事件
      /*  window.onload = function () {
            var tableWidth = $(".basic-info").width();
            var $wheelElement = $(".contrast-table");
            var wheelElement = $(".contrast-table")[0];
            var scrollMaxWidth =  250 ;

            "onmousewheel" in wheelElement ? wheelElement.onmousewheel = wheel : wheelElement.addEventListener("DOMMouseScroll", wheel);
            var count = 0;

            function wheel(e) {
                var e = e || event
                var v = e.wheelDelta || -e.detail;

                if ($(".contrast-table").scrollLeft() <= scrollMaxWidth && $(".contrast-table").scrollLeft() >= 0) {
                    if (v > 0) {
                        $wheelElement.stop(true).animate({
                            scrollLeft: $(".contrast-table").scrollLeft() - 241
                        }, 300,function() {

                        });
                    }
                    else {
                        $wheelElement.stop(true).animate({
                            scrollLeft: $(".contrast-table").scrollLeft() + 241
                        }, 300, function () {
                        });
                    }


                }

                e.preventDefault && e.preventDefault();
                return false;
            }
        }*/
    }

    var getContentList =function(index)
    {
        var list = $();
        var index = index;
        $("table tr").each(function(idx,item) {
            var deleteElement = $(item).children()[index];
            list.push(deleteElement);
        });
        return list;
    }

    var getCellContent = function(cell) {
        var a = cell.find("a");
        if (a.length != 0) {
            return {
                content: a.text(),
                type: "a"
            };
        }

        var span = cell.find("span");
        if (span.length != 0) {
            return {
                content: span.text(),
                type: "span"
            };
        }

        var img = cell.find("img");
        if (img.length != 0) {
            return {
                content: img,
                type: "img"
            };
        }

        return {
            content: cell.text(),
            type: ""
        };
    }

    var setCellContent = function(cell,content) {
        if (content) {
            if (content.type === "img") {
                var img = cell.find(content.type);
                if(img.length!=0) {
                    cell.find(content.type).attr("src", content.content.attr("src"));
                }
                else
                {
                    cell.html("<img src='"+content.content.attr("src")+"' width='215px' height='140px'>");
                }
            }
            else if (content.type === "a" || content.type === "span") {
                cell.find(content.type).text(content.content);
            }
            else {
                cell.text("");
            }
        }
        else {
            var type = getCellContent(cell).type;
            if (type === "img") {
                cell.find(type).remove();
            }
            else if (type === "a" || type === "span") {
                cell.find(type).text("");
            }
            else {
                cell.text("");
            }
        }
    }

    var addNewContent=function(list,index,param) {
        console.log("insert:" + index);
        var position = index;
        if (index != undefined) {
            $("table tr").each(function (idx, item) {
                if (param) {
                    $(item).find(".tempalte").remove();
                    $(list[idx]).addClass("tempalte");
                    $(item.children[position]).after($(list[idx]));
                }
                else
                {
                    $(item.children[position]).after($(list[idx]));
                }
            });
        }
        else {
            $("table tr").each(function (idx, item) {
                $(item).append($(list[idx]));
            });
        }
    }

    var deleteContent =function(index)
    {
        var list = getContentList(index);

        if(showScroll_x) {
            list.remove();
        }
        else
        {
            list.remove();
            if(carCount<=4) {
                addNewContent($(contentTemplate));
            }
        }
        carCount--;
    }

    var init = function (_config) {
        $.extend(config, _config);
        carCount = config.carNum;

        _bind();
    }

    carContrast.init = init;
    return carContrast;
});