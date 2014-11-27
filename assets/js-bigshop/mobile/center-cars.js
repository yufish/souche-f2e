var Cars = (function() {
    isLoadingMore = false;
    hasMore = false;
    nowPage = 2;
    totalPage = null;
    var config = {
        api: "#",
        totalPage: null
    }


    var loadMore = function() {
        isLoadingMore = true;
        $(".load-more").removeClass("hidden");
        if (nowPage > config.totalPage * 1) {
            hasMore = false;
            return;
        }
        $.ajax({
            url: config.api,
            data: {
                page: nowPage++,
            },
            success: function(data) {
                if (data.replace(/\s/g, '') == "") {
                    hasMore = false;
                }
                $(".load-more").addClass("hidden");
                isLoadingMore = false;
                $(".common-cars").append(data);
            }
        })
    }
    return {
        init: function(_config) {
            $.extend(config, _config);
            $(window).on("scroll", function() {
                if (isLoadingMore || !hasMore) return;
                if ($(window).scrollTop() + $(window).height() >= $(document.body).height()) {
                    loadMore();
                }
            })
        }
    }
})();