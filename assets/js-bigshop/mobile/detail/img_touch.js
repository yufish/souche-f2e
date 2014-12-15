/**
 * Created by zilong on 2014/8/6.
 */
//小图相关操作
!function(){
    var numOfImg = $('#pic-container .img-card').length;
    var numOfScreen = Math.ceil(numOfImg / 3);
    $('#pic-container').css({width: numOfImg * 96 + '%'});
    $('#pic-container .img-card').css({width: 96 / numOfImg /3 + '%'});

    !function makeDots() {
        var dotContainer = $('#pic-dots');
        var html = '<i class="dot active"></i>';
        for (var i = 1; i < numOfScreen; i++) {
            html += '<i class="dot"></i>'
        }
        dotContainer.append(html);
    }();
    var dots = $('#pic-dots .dot');
    $("#pic-container").swipeLeft(function (e) {
        var self = $(this);
        var picIndex = +self.attr('data-index');
        picIndex=picIndex|0;
        if (picIndex == numOfScreen - 1)return;
        var nextIndex = picIndex + 1;
        self.animate({'margin-left': -nextIndex * 92 + '%'})
        self.attr('data-index', nextIndex)
        dots.eq(picIndex).removeClass('active');
        dots.eq(nextIndex).addClass('active');
    }).swipeRight(function (e) {
        var self = $(this);
        var picIndex = +self.attr('data-index');
        if (picIndex == 0)return;
        var nextIndex = picIndex - 1;
        self.animate({'margin-left': -nextIndex * 92 + '%'})
        self.attr('data-index', nextIndex);
        dots.eq(picIndex).removeClass('active');
        dots.eq(nextIndex).addClass('active');
    })
}()

//大图相关操作
!function(){
    var imgCover = $('.big-picture');
    var bigImgCtn = $('.big-picture .slides');
    var bigImgCard = $(".big-picture .big-img-card")
    var numOfImg = bigImgCard.length;
//    bigImgCtn.css({width:100*numOfImg+"%"})
//    bigImgCard.css({width:100/numOfImg+'%'});
    function showImg($img){
        var attrValue = $img.attr('data-src');
        if(attrValue){
            $img.attr('src',attrValue);
            $img.removeAttr('data-src');
        }
    }
    $('#pic-container .img-card').on('click',function(e){
        var index = +$(this).attr('data-index');
        $(".big-picture").removeClass("hidden")
//        bigImgCtn.css({'margin-left':-index*100+'%'})
//        showImg(bigImgCard.eq(index).find('img'));
        bigImgCard.find("img").each(function(i,img){
            $(img).attr("src",$(img).attr("data-src"))
        })
        imgCover.data('index',index)
        e.preventDefault();
    })
//    imgCover.swipeLeft(function(e){
//        var picIndex = +imgCover.data('index');
//        if(picIndex==numOfImg-1)return;
//        var nextIndex = picIndex + 1;
//        showImg(bigImgCard.eq(nextIndex).find('img'))
//        bigImgCtn.animate({'margin-left':-nextIndex*100+'%'});
//        imgCover.data(nextIndex);
//        imgCover.data('index',nextIndex)
//    }).swipeRight(function(e){
//        var picIndex = +imgCover.data('index');
//        if(picIndex==0)return;
//        var nextIndex = picIndex - 1;
//        showImg(bigImgCard.eq(nextIndex).find('img'))
//        bigImgCtn.animate({'margin-left':-nextIndex*100+'%'});
//        imgCover.data(nextIndex);
//        imgCover.data('index',nextIndex)
//    })
    $('.big-picture').click(function(){
        $(this).addClass('hidden');
    })
}()

