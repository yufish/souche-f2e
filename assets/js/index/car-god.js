define(function() {
    var carGod = {
        init: function() {
            var ITEM_DETAIL_HEIGHT = 150;
            var lastExpanItem = $("#qa .cheshen-box .cheshen-detail:eq(0)");
            var lastExpanIndex = 0;
            //为每个item编号
            $("#qa .cheshen-box .cheshen-detail").each(function(i, detail) {
                $(detail).attr("data-index", i);
            })
            $("#qa .cheshen-box .cheshen-detail").css({
                height: 0
            })
            $("#qa .cheshen-box .cheshen-detail:eq(0)").css({
                height: ITEM_DETAIL_HEIGHT
            });
            var isAnim = false;
            $("#qa .cheshen-box").on("mouseover", function() {
                var nowDetail = $(this).find(".cheshen-detail");
                var nowIndex = nowDetail.attr("data-index");
                //如果正在动，直接忽略事件
                //如果展开和浮上的一样，直接忽略事件
                if (!isAnim && lastExpanIndex != nowIndex) {
                    lastExpanItem.animate({
                        height: 0
                    }, 400);
                    isAnim = true;
                    setTimeout(function() {
                        isAnim = false;
                    }, 500);
                    $(this).find(".cheshen-detail").animate({
                        height: ITEM_DETAIL_HEIGHT
                    }, 400)
                    $("#qa .show").removeClass("close")
                    $(this).find(".show").addClass("close")
                    lastExpanItem = nowDetail;
                    lastExpanIndex = nowIndex;
                }

            })
        }
    }
    return carGod;
})