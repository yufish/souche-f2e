var Pet = (function() {
    var loadingTip = function() {

        var tip = document.createElement("div")
        tip.className = "loading-tip"
        tip.innerHTML = "加载中"
        document.body.appendChild(tip)
        return {
            show: function(text) {
                tip.innerHTML = text || "加载中"

                $(tip).css("display", "block").animate({
                    opacity: 0.9
                }, 500)
            },
            hide: function() {
                $(tip).animate({
                    opacity: 0
                }, 500, null, function() {
                    $(tip).css("display", "none")
                })

            }
        }
    }();
    var config = {
        likeApi: "#",
        moreApi: "#"
    }
    isLoadingMore = false;
    hasMore = true;
    nowPage = 1;
    var tpl = "";
    var order_time = 0;
    var order_hot = 0;
    var loadMore = function(callback) {
        isLoadingMore = true;

        $(".loading").removeClass("hidden");
        if (nowPage > config.totalPage * 1) {
            hasMore = false;
            return;
        }
        loadingTip.show()
        $.ajax({
            url: config.moreApi,
            data: {
                page: nowPage++,
                time_order: config.sort_time,
                hot_order: config.sort_hot
            },
            dataType: "json",
            success: function(data) {
                callback && callback();
                if (!data.hasMore) {
                    hasMore = false;
                }
                $(".loading").addClass("hidden");
                isLoadingMore = false;
                $(".normal-result").append(Mustache.render(tpl, {
                    pets: data.pets
                }));
                loadingTip.hide();

            },
            error: function() {
                loadingTip.hide();
            }
        })
    }
    var reload = function() {
        nowPage = 1;
        isLoadingMore = false;
        hasMore = true;

        loadMore(function() {
            $(".normal-result").html("")
        });
    }
    return {
        init: function(_config) {
            $.extend(config, _config);
            tpl = $("#car_tpl").html();
            $("#content").on("click", ".like", function(e) {
                e.preventDefault();
                var id = $(e.target).closest(".item").attr("data-id");
                $.ajax({
                    url: config.likeApi,
                    type: "get",
                    dataType: "json",
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.success) {
                            $(".like-count", $(e.target).closest(".item")).html($(".like-count", $(e.target).closest(".item")).html() * 1 + 1)
                        } else {
                            window.location.href = config.favGoUrl
                        }
                    }
                })
            })
            // $(".bytime").on("click", function(e) {
            //     $(this).addClass("active")
            //     $(".byhot").removeClass("active")
            //     if (order_time == 0) {
            //         order_time = 1;
            //     } else if (order_time == 1) {
            //         order_time = -1;
            //     } else {
            //         order_time = 1;
            //     }
            //     if (order_time == -1) {
            //         $(".arrow", this).removeClass("up").addClass("down");
            //     } else {
            //         $(".arrow", this).removeClass("down").addClass("up");
            //     }
            //     reload();
            // })

            // $(".byhot").on("click", function(e) {
            //     $(".bytime").removeClass("active")
            //     $(this).addClass("active")
            //     if (order_hot == 0) {
            //         order_hot = 1;
            //     } else if (order_hot == 1) {
            //         order_hot = -1;
            //     } else {
            //         order_hot = 1;
            //     }
            //     if (order_hot == -1) {
            //         $(".arrow", this).removeClass("up").addClass("down");
            //     } else {
            //         $(".arrow", this).removeClass("down").addClass("up");
            //     }
            //     reload();
            // })
            //滚到底部自动加载更多
            $(window).on("scroll", function() {
                if (isLoadingMore || !hasMore) return;
                if ($(window).scrollTop() + $(window).height() >= $(document.body).height()) {
                    loadMore();
                }
            })
            //搜索
            $("#search_form").on("submit", function(e) {
                e.preventDefault();
                loadingTip.show();
                if (!$("#search_input").val()) {
                    alert("ID不能为空")
                    return;
                }
                $.ajax({
                    url: config.searchApi,
                    dataType: "json",
                    data: {
                        id: $("#search_input").val()
                    },
                    success: function(data) {
                        if (data.success) {
                            $(".search-result").html(Mustache.render(tpl, {
                                pets: data.pets
                            })).removeClass("hidden");
                        } else {
                            alert(data.info)
                        }

                        loadingTip.hide();
                    },
                    error: function() {
                        loadingTip.hide();
                    }
                })
                $("#search_input").val("")
            })
            $(".shai").click(function() {
                $(".layer").css({
                    height: $(document.body).height()
                }).removeClass("hidden")
            })
            $(".layer").click(function() {
                $(this).addClass("hidden")
            })
            loadMore(); //加载第一次
        }
    }
})();