
$(document).ready(function(){
    var win = $(window);
    var winH = win.height();
    var okBtn =$('.popup-btns');
    okBtn.css({
        width:win.width()-20
    })
    win.scroll(function(){
        popupBtnPositioned();
    })
    function popupBtnPositioned(){
        var srTop = win.scrollTop();
        okBtn.css({
            top:winH +srTop -  60
        })
    }
    popupBtnPositioned();
    //window.popupBtnPositioned = popupBtnPositioned;
})

