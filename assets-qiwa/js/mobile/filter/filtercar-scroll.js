
$(document).ready(function(){
    var win = $(window);
    var winH = win.height();
    var okBtnWrapper =$('.popup-btns-wrapper');
    okBtnWrapper.css({
        width:win.width()-20
    })
    win.scroll(function(){
        popupBtnPositioned();
    })
    function popupBtnPositioned(){
        var srTop = win.scrollTop();
        okBtnWrapper.css({
            top:winH +srTop -  80
        })
    }
    popupBtnPositioned();
    //window.popupBtnPositioned = popupBtnPositioned;
});
