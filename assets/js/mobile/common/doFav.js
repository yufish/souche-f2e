/**
 * Created by zilong on 2014/8/8.
 */
//前置条件
/*
* dom:
*   .fav(data-id = carId)
*       span.star-shape (这个不强求)
*       span.fav-num
* */

//检查是否填过手机号
!function(){
    window.Souche = window.Souche || {};
    if(!Souche.checkPhoneExist){
        Souche.checkPhoneExist = function(callback) {
            $.ajax({
                url: contextPath + "/pages/evaluateAction/isNoRegisterLogin.json",
                type: "post",
                dataType: "json",
                success: function(data) {
                    if (data.result == "true") {
                        callback(true)
                    } else {
                        callback(false)
                    }
                },
                error: function() {
                    callback(false)
                }
            })
        };
    }

//一步注册手机号
    if(!Souche.PhoneRegister) {
        Souche.PhoneRegister = function (phone, callback) {
            $.ajax({
                url: contextPath + "/pages/evaluateAction/noRegisterLogin.json",
                type: "post",
                dataType: "json",
                data: {
                    phone: phone
                },
                success: function (data) {
                    if (data.errorMessage) {
                        callback(false)
                    } else {
                        callback(true)
                    }
                },
                error: function () {
                    callback(false)
                }
            })
        };
    }
}()

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
                if(cb)cb()
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
                if(cb)cb();
            }
        })
    }

    function doFav($node,cb) {
        if($node.attr('data-processing')=='1'){return;}
        $node.attr('data-processing','1');
        if ($node.hasClass('active')) {
            delFav($node,cb);
        } else {
            saveFav($node,cb);
        }
    }
    return doFav;
}();