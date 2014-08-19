/**
 * Created by zilong on 2014/8/8.
 */
//前置条件
/*
* dom:
*   .fav(data-id = carId)
*       span.star-shape
*       span.fav-num
* */

 var doFav = function() {
    var api = {
        fav: contextPath + '/pages/saleDetailAction/savaCarFavorite.json',
        unfav: contextPath + '/pages/saleDetailAction/delCarFavorite.json'
    };

    function saveFav($node,cb) {
        $.ajax({
            url: api.fav,
            data: {
                carId: $node.attr("data-id"),
                platform : 'PLATFORM_H5'
            },
            dataType: "json",
            success: function() {
                $node.addClass("active");
                var $numSpan = $node.find('.fav-num');
                var i = parseInt($numSpan.text());
                $numSpan.text(i + 1);
                $node.attr('data-processing','0');
                if(cb)cb($node)
            }
        })
    }

    function delFav($node,cb) {
        $.ajax({
            url: api.unfav,
            data: {
                'carId': $node.attr("data-id"),
                platform : 'PLATFORM_H5'
            },
            dataType: "json",
            success: function() {
                $node.removeClass("active");
                var $numSpan = $node.find('.fav-num');
                var i = parseInt($numSpan.text());
                $numSpan.text(i - 1);
                $node.attr('data-processing','0');
                if(cb)cb($node);
            }
        })
    }

    function doFav($node,saveCallBack,delCallBack) {
        if($node.attr('data-processing')=='1'){return;}
        $node.attr('data-processing','1');
        if ($node.hasClass('active')) {
            delFav($node,delCallBack);
        } else {
            saveFav($node,saveCallBack);
        }
    }
    return doFav;
}();