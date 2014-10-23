var Action = (function () {
    var phoneReg = /^1[3458][0-9]{9}$/;
    return {
        init: function () {
            var hasYuyue = false;
            $("#yuyue-submit").on("click", function (e) {
                e.preventDefault();
                if (hasYuyue)
                    return;
                SM.checkPhoneExist(function(is_login) {
                    if (is_login) {
                        submitYuyue();
                    } else {
                        showPopup($('#for-yuyue'));
                    }
                })
            })
            $('#yuyue-form').on('submit', function (e) {
                e.preventDefault();
                var phoneNum = $("#phone-for-yuyue").val();
                if (!phoneReg.test(phoneNum)) {
                    $(".wrong-tip", this).removeClass("hidden");
                } else {
                    SM.PhoneRegister(phoneNum, function () {
                        submitYuyue();
                    })
                }
            });
            window.onhashchange = function(e){
                    if(location.hash=='#yuyue_success'){
                        $('#yuyue-success').removeClass('hidden');
                        $('#J_fake-back').removeClass('hidden');
                    }else{
                        $('#yuyue-success').addClass('hidden');
                        $('#J_fake-back').addClass('hidden');
                    }
            }
            $('#J_fake-back').click(function(){
                $('#yuyue-success').addClass('hidden');
                $('#J_fake-back').addClass('hidden');
                history.back()
            })
            if(location.hash=='#yuyue_success'){
                history.replaceState(null,document.title,location.pathname+location.search)
            }
            var submitYuyue = function () {
                $.ajax({
                    url:$('#yuyue-submit').attr('data-url'),
                    type:'post',
                    dataType:'json',
                    success:function(e){
                        //e.type,e.code,e.orderSn
                        var orderSn = 2;
                        var type=2;
                        if(type=='2'){
                            window.location.href='yuyue_detail.html?yuyueId='+orderSn;
                        }else{
                            $('#yuyue-success').removeClass('hidden');
                            $('#J_fake-back').removeClass('hidden');
                            history.pushState(null,'','#yuyue_success');
                        }
                    }
                })



            };
            var favDom;
            $(".detail-fav").on("click", function (e) {
                favDom =  $(this);
                var carId=$(this).attr('data-id')
                e.preventDefault();
                SM.checkPhoneExist(function(is_login) {
                    if (is_login) {
                        submitFav(carId);
                    } else {
                        showPopup($('#for-fav'))
                    }
                })
            })
            $('#fav-form').on('submit', function (e) {
                e.preventDefault();
                var phoneNum = $("#phone-for-fav").val();
                if (!phoneReg.test(phoneNum)) {
                    $(".wrong-tip", this).removeClass("hidden");
                } else {
                    SM.PhoneRegister(phoneNum, function () {
                        submitFav(favDom.attr('data-id'));
                    })
                }
            });
            var submitFav = function (carId) {
                if(favDom.hasClass("active")){
                    delFav(carId)
                }else{
                    saveFav(carId);
                }

            };
            var favUrl = {
                fav: contextPath + '/pages/saleDetailAction/savaCarFavorite.json',
                unfav: contextPath + '/pages/saleDetailAction/delCarFavorite.json'
            };
            function saveFav(carId){
                $(".detail-fav .fav-text").html('收藏中...')
                $.ajax({
                    url: favUrl.fav,
                    dataType: "json",
                    data: {
                        platform : 'PLATFORM_H5',
                        carId: carId
                    },
                    success: function () {
                        $(".detail-fav .fav-text").html("已收藏")
                        $(".detail-fav").addClass('active');
                        //收藏成功后的动画
                        var offset1 = favDom.offset();
                        var left1 = offset1.left,top1 = offset1.top;
                        var offset2 = $('.for-other-topic').offset();
                        var left2 = offset2.left,top2 = offset2.top;
                        var moveDom = $('<div class="fly-fivestar"></div>');
                        moveDom.css({
                            left:left1,
                            top:top1,
                            "z-index":10005
                        }).appendTo(document.body).animate({
                            left:left2+30,
                            top:top2+10
                        },700,function(){
                            moveDom.remove();
                            $('.other-topic .icon-dot').show();
                        })

                        hidePopup();
                    }
                })
            }
            function delFav(carId){
                $(".detail-fav .fav-text").html('取消中...')
                $.ajax({
                    url: favUrl.unfav,
                    dataType: "json",
                    data: {
                        platform : 'PLATFORM_H5',
                        carId: carId
                    },
                    success: function (data) {
                        $(".detail-fav .fav-text").html("收藏")
                        $(".detail-fav").removeClass('active');
                        hidePopup();
                    }
                })
            }
            var showPopup = function ($popup) {
                var scrollTop = $(window).scrollTop();
                var top = scrollTop + 50;
                $popup.css({
                    top: top
                }).removeClass("hidden");
                $(".wrapGrayBg").removeClass('hidden');
            };
            function hidePopup() {
                $('#for-yuyue').addClass('hidden');
                $('#for-fav').addClass('hidden');
                $('.wrapGrayBg').addClass('hidden');
            }
            $('.phone-input').focus(function () {
                $('.wrong-tip').addClass('hidden');
            });


            $("#show_stantard").on("click",function(){
                $("#standard").css({
                    left:"2.5%",
                    top:30
                }).removeClass("hidden")
                $(".wrapGrayBg").removeClass('hidden');
            })
            $('#hide_standard').click(function(){
                $('.wrapGrayBg').addClass('hidden');
                $("#standard").addClass('hidden')
            })

        }
    }
})();
