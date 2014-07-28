/**
 * Created by zilong on 2014/7/25.
 */
!function(){
    return function(){
        var api = {
                fav:contextPath+'/pages/saleDetailAction/savaCarFavorite.json',
                unfav:contextPath+'/pages/saleDetailAction/delCarFavorite.json'
            };
        function showPopup(){
            $('.wrapPhoneBg').removeClass('hidden');
            var $popup = $('#phone-popup');
            $popup.removeClass('hidden').css({'left':( $(window).width() - $popup.width()) / 2});

        }
        function hidePopup(){
            $('.wrapPhoneBg').addClass('hidden');
            $('#phone-popup').addClass('hidden');
        }
        function saveFav($node){
            var $node = $node;
            $.ajax({
                url:api.fav,
                data:{
                    carId:$node.attr("data-id"),
                    platform : 'PLATFORM_H5'
                },
                dataType:"json",
                success:function(){
                    $node.addClass("star");
                    var $numSpan = $node.find('span');
                    var i = parseInt($numSpan.text());
                    $numSpan.text(i+1);
                }
            })
        }
        function delFav($node){
            $.ajax({
                url:api.unfav,
                data:{'carId':$node.attr("data-id"),platform : 'PLATFORM_H5'},
                dataType:"json",
                success:function(){
                    $node.removeClass("star");
                    var $numSpan = $node.find('span');
                    var i = parseInt($numSpan.text());
                    $numSpan.text(i-1);
                }
            })
        }
        function doFav($node){
            if($node.hasClass('star')){
                delFav($curFav);
            }else{
                saveFav($curFav);
            }
        }
        var isLogin = false;
        var $curFav;
        var phoneReg = /^1[3458][0-9]{9}$/;
        $('#phone-form').submit(function(e) {
            var phoneNum = $("#phone-num").val();
            e.preventDefault();
            if (!phoneReg.test(phoneNum)) {
                alert('请输入正确的手机号码');
            } else {
                SM.PhoneRegister(phoneNum, function() {
                    hidePopup();
                    isLogin = true;
                    doFav($curFav);
                })
            }
        })
        $('#back-btn').click(function(){
            hidePopup();
        });
        $('.fav-wrapper').on('click','.fav',function(e){
            e.preventDefault();
            $curFav = $(this);
            if(isLogin){

                doFav($curFav);
                return;
            }
            SM.checkPhoneExist(function(is_login) {
                if(is_login) {
                    doFav($curFav);
                }else {
                    showPopup()
                }
            })
        })
    }

}();