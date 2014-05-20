define(function(){
    var Act = function () {
        return {
            init: function (loadMoreUrl,picWidth) {
                $(window).on("scroll", function() {
                    if ($(window).scrollTop() + $(window).height() >= $(document.body).height()) {
                        loadMore();
                    }
                });
                function loadMore(){
                    $.ajax({
                        url: loadMoreUrl,
                        data: {
                            index: (pageIndex++)
                        },
                        success: function (data) {
                            historyActs.append(data);
                        }
                    });
                }

                //var picWidth = 800;
                var pageIndex = 2;
                var historyActs = $('#history-acts');
                var container = $('#banner-container');
                var banners = $('.banner-item', container);//original banner
                var len = banners.length;
                var totalPx = len * picWidth;
                var curIndex = 0;

                container.mouseenter(function(e){
                    $('.look-this-act').fadeIn();
                    $(this).one('mouseleave',function(){
                        $('.look-this-act').fadeOut();
                    })
                })
                ! function clone() {
                    var clone = banners.clone();
                    container.prepend(clone);
                }()
                container.css({
                    width: totalPx * 2,
                    left: -len * picWidth
                });

                $('.left-arrow').click(function() {
                    var first = $('#banner-container .banner-item').first();
                    // var firstImg = $(first, 'img');
                    var firstClone = first.clone();
                    first.animate({
                        width: 0
                    }, function() {
                        first.remove();
                        container.append(firstClone);
                    })
                    curIndex = getIndexSafe(++curIndex);
                })
                $('.right-arrow').click(function() {
                    var last = $('#banner-container .banner-item').last();
                    var lastClone = last.clone();
                    lastClone.css({
                        width: 0
                    });
                    last.remove();
                    container.prepend(lastClone);
                    lastClone.animate({
                        width: picWidth
                    })
                    curIndex = getIndexSafe(--curIndex);
                })
                var getIndexSafe = function(length){
                    return function(idx){
                        if(idx>=len)return idx-len;
                        if(idx<0)return idx+len;
                        return idx;
                    }
                }(len);
                $('.cover-left').click(function(){
                    var leftIndex = getIndexSafe(curIndex-1);
                    window.location.href = banners.eq(leftIndex).attr('href');
                })
            }
        }
    }();
    return Act;
})
