define(function() {


    $(".search-text").focus();
    $(document).ready(function() {
        setTimeout(function() {
            $(".double11").animate({
                height: "0px"
            }, 1000);
        }, 3000);
        setTimeout(function() {
            $(".double11-sort").animate({
                height: "135px",
                opacity: 1
            }, 1000);
        }, 4000);
    });
    $(".cord-h5").mouseenter(function() {
        $(".h5-open").slideDown("normal");
    });
    $(document.body).on("click", function(e) {
        if (!$(e.target).closest(".h5-open").length) {
            $(".h5-open").slideUp("normal");
        }
    });
    $("#J_phone_login").on("click", function(e) {
        e.preventDefault();
        Souche.MiniLogin.checkLogin(function() {
            $(".qiugou .go-login").addClass("hidden")
            window.location.reload();
        }, true, false, true);
    });
    var HeaderConfig = {
        selectSearch: contextPath + "/pages/headerAction/selectSearchCode.json"
    };
    $("#J_logout").on("click",function(e){
        e.preventDefault();
        var self  = this;
        $.ajax({url:contextPath + "/pages/clear_cookie.html",success:function(){
            window.location.href=$(self).attr("href")
        }});

    })
    $.ajax({
        type: "GET",
        url: HeaderConfig.selectSearch,
        dataType: "json",
        success: function(data) {
            if (data && data.items) {
                var html = "";
                for (var i = 0; i < data.items.length; i++) {
                    var keyword = data.items[i].name;
                    var searchcode = data.items[i].searchCode;
                    html += "<a click_type='search-item" + i + "' href='/pages/onsale/sale_car_list.html?keyword=" + searchcode + "' target='_blank'>" + keyword + "</a>"
                }
                $(".recom").html(html)
            }
        }
    });
    var nowCity = {
        name: "",
        code: ""
    };
    $.ajax({
        type: "GET",
        url: contextPath + "/pages/toolbarAction/getAdderssMap.json",
        dataType: "json",
        success: function(data) {
            if (data && data.addressName) {
                $("#J_city_show").html(data.addressName);
                nowCity.code = data.cityCode?data.cityCode:data.provinceCode;
                nowCity.name = data.addressName;
                $(".city-wrap a").removeClass("active-city");
                $(".city-wrap a[data-code='" + nowCity.code + "']").addClass("active-city");
                document.title = document.title.replace(/北京/g, data.addressName)
            }
        }
    });
    
    // 城市切换popover的操作 绑定
    (function(){
        // var isInCity = false;
        var timerShow, timerHide;
        function show(){
            $(".city-open").css({
                opacity: 1
            }).removeClass("hidden");
            $(".area-box").css({
                left: "0px"
            });
            $(".city-box").css({
                left: "362px"
            });
        }
        function hide(){
            $(".city-open").addClass("hidden");
        }
        // 显示 hover 和 点击都可以
        $(".city").on("mouseenter",function(e) {
            clearTimeout(timerHide);
            timerShow = setTimeout(function(){
                show();
            }, 66);
        });
        $(".city").on("click", function(e){
            // clearTimeout(timerShow);
            // clearTimeout(timerHide);
            // if( $(".city-open").hasClass("hidden") ){
            //     show();
            // }
            // else{
            //     hide();
            // }
            e.stopPropagation();
        });
        // 在popover上操作, 保持弹出状态
        $('.city-open').on('click mouseenter', function(e){
            clearTimeout(timerHide);
            e.stopPropagation();
        });


        $(".city").on("mouseleave",function(){
            timerHide = setTimeout(function(){
                hide();
            }, 500);
        });
        $(document.body).on("click", function(e) {
            hide();
        });
    })();

    var loadCity = function(provinceCode, provinceName) {
        $("#J_province_title").html(provinceName);
        $.ajax({
            url: contextPath + "/pages/toolbarAction/queryCities.json",
            data: {
                code:provinceCode
            },
            dataType: "json",
            success: function(data) {
                $(".city-list").html("");
                if (data && data.items) {
                    $(".city-list").append("<a class='city-item' data-code='" + provinceCode + "'>全部城市</a>")
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        $(".city-list").append("<a class='city-item " + (item.code == nowCity.code ? "active-city" : "") + "' data-code='" + item.code + "'>" + item.name + "</a>")
                    }
                    $(".city-item").on("click", function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        goCity($(this).attr("data-code"))
                    });
                }
            }
        })
    }
    var goCity = function(code) {
        $.ajax({
            url: contextPath + "/pages/toolbarAction/choosePosition.json",
            dataType: "json",
            data: {
                position: code
            },
            success: function() {
                window.location.reload();
            }
        });
    }
    $(".J_hotcity").click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        goCity($(this).attr("data-code"));
        return;
    })
    $(".hot-item").click(function(e) {
        if ($(this).hasClass("hot-item-all")) {
            goCity($(this).attr("data-code"))
            return;
        }
        loadCity($(this).attr("data-code"), $(this).html());
        $(".area-box").animate({
            left: "-362px"
        }, 400);
        $(".city-box").animate({
            left: "0px"
        }, 400);
        e.stopPropagation();
    });
    $(".province-item").click(function(e) {
        if ($(this).hasClass("direct-item")) {
            goCity($(this).attr("data-code"))
            return;
        }
        loadCity($(this).attr("data-code"), $(this).html());
        $(".area-box").animate({
            left: "-362px"
        }, 400);
        $(".city-box").animate({
            left: "0px"
        }, 400);
        e.stopPropagation();
    });
    $(".city-return").click(function(e) {
        $(".area-box").animate({
            left: "0px"
        }, 400);
        $(".city-box").animate({
            left: "362px"
        }, 400);
        e.stopPropagation();
    });
    $(".city-close").on("click", function(e) {
        $(".city-open").addClass("hidden");
        e.stopPropagation();
    });






    var isInUser = false;
    var _event = {
        bind: function() {
            $('#header .user .login-text').on('click', _event.login);
            $('#header .user').on('mouseenter', _event.popUserMenu);
            _event.bindUsermenuHide();

            var searchForm = $('#header .index-search');
            $('#header .search-text').on('focus', function(){
                searchForm.addClass('input-focusing');
            });
            $('#header .search-text').on('blur', function(){
                searchForm.removeClass('input-focusing');
            });
        },
        login: function() {
            Souche.MiniLogin.checkLogin(function() {
                window.location.href = window.location.href;
            }, true, false, true);
        },
        popUserMenu: function() {
            isInUser = true;
            setTimeout(function(){
                if(isInUser){
                    $('#user-menu').addClass('active');
                }
            },300)
        },
        bindUsermenuHide: function() {
            $(document.body).on('click', function() {
                $('#user-menu').removeClass('active');
            });
            $('#header .user').on('mouseleave', function(){
                isInUser = false;
                setTimeout(function(){
                    if(!isInUser){
                        $('#user-menu').removeClass('active');
                    }
                },500)
            });
            var stopBubbleEles = $('#header .user .headpic, #header .user .trigger, #user-menu');
            stopBubbleEles.on('click', function(e) {
                e.stopPropagation();
            });
        }
    };

    function init() {
        _event.bind();
    }

    return {
        init: init
    };
});