define( ['souche/realTimeDown'], function(searchSuggest) {
    // 不auto focus
    // $(".search-text").focus();

    $(document).ready(function() {

        searchSuggest.init($(".search"), {
               url: contextPath + "/pages/common/boxSuggestAction/list.json",
               type: "GET",
               dataType: "json",
               success: function() {}
           }, 900);
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
                    html += "<a click_type='search-item" + i + "' href='"+$(".index-search").attr("action")+"?keyword=" + searchcode + "' target='_blank'>" + keyword + "</a>"
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
        });
        // 在popover上操作, 保持弹出状态
        $('.city-open').on('click mouseenter', function(e){
            clearTimeout(timerHide);
        });


        $(".city").on("mouseleave",function(){
            timerHide = setTimeout(function(){
                hide();
            }, 500);
        });

    })();

    var loadCity = function(provinceCode, provinceName,pinyin) {
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
                    $(".city-list").append("<a class='city-item' data-pinyin='"+pinyin+"' data-code='" + provinceCode + "' click_type='city-"+provinceCode+"'>全部城市</a>");
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        $(".city-list").append("<a data-pinyin='"+item.check+"' class='city-item " + (item.code == nowCity.code ? "active-city" : "") + "' data-code='" + item.code + "' click_type='city-"+provinceCode+"'>" + item.name + "</a>")
                    }
                    $(".city-item").on("click", function(e) {
                        e.preventDefault();
                        goCity($(this).attr("data-code"),$(this).attr("data-pinyin"))
                    });
                }
            }
        })
    }

    // 某些页面进行本页刷新
    // 某些页面要跳转到特定页面
    // 下面是需要跳转的页面的规则列表
    var PAGE_HOME = '/';
    var PAGE_LIST = contextPath + '/pages/onsale/sale_car_list.html';
    var PAGE_SEO_LIST = contextPath+"";
    // 基础规则 还需要下面的修饰
    var baseRules = {
        // 主题精选 list页和详情页 都条状往首页
        '/pages/acts/theme-activity-all.html': PAGE_HOME,
        '/pages/acts/activity_car_list.html': PAGE_HOME,
        // detail页 跳往list页
        '/pages/choosecarpage/choose-car-detail.html': PAGE_LIST,
        // 营销活动list页（限时特价，好车日报）：切换首页
        '/pages/timelimit_price.html': PAGE_HOME,
        '/pages/car-journal.html': PAGE_HOME,
        // list页面 把所有的query条件过滤掉
        '/pages/onsale/sale_car_list.html': PAGE_LIST
    };
    var regRules = {
        "/.*?/list":"/[location]/list",
        "/[^?/]*?$":"/[location]"
    }
    // 匹配添加contextPath
    var jump_rules = {}
    for(var r in baseRules){
        jump_rules[contextPath + r] = baseRules[r] ;
    }
    var goCity = function(code,pinyin) {
        $.ajax({
            url: contextPath + "/pages/toolbarAction/choosePosition.json",
            dataType: "json",
            data: {
                position: code
            },
            success: function() {
                var curPath = location.pathname;
                for(var i in regRules){
                    var reg = new RegExp(i)
                    if(reg.test(curPath)){
                        window.location.href=contextPath+regRules[i].replace("[location]",pinyin)
                        return;
                    }else{
                    }
                }
                if( jump_rules[curPath] === undefined ){
                    window.location.reload();
                }
                else{
                    window.location.href = jump_rules[curPath];
                }
            }
        });
    }
    $(".J_hotcity").click(function(e) {
        e.preventDefault();
        goCity($(this).attr("data-code"),$(this).attr("data-pinyin"));
        return;
    })
    $(".hot-item").click(function(e) {
        if ($(this).hasClass("hot-item-all")) {
            goCity($(this).attr("data-code"),$(this).attr("data-pinyin"))
            return;
        }
        loadCity($(this).attr("data-code"), $(this).html(),$(this).attr("data-pinyin"));
        $(".area-box").animate({
            left: "-362px"
        }, 400);
        $(".city-box").animate({
            left: "0px"
        }, 400);
    });
    $(".province-item").click(function(e) {
        if ($(this).hasClass("direct-item")) {
            goCity($(this).attr("data-code"),$(this).attr("data-pinyin"))
            return;
        }
        loadCity($(this).attr("data-code"), $(this).html(),$(this).attr("data-pinyin"));
        $(".area-box").animate({
            left: "-362px"
        }, 400);
        $(".city-box").animate({
            left: "0px"
        }, 400);
    });
    $(".city-return").click(function(e) {
        $(".area-box").animate({
            left: "0px"
        }, 400);
        $(".city-box").animate({
            left: "362px"
        }, 400);
    });
    $(".city-close").on("click", function(e) {
        $(".city-open").addClass("hidden");
    });


    var _view = {
        init: function(){
            _view.addClickType();
        },
        /*
         * 添加click_type
         *      热门城市: hotcity-xxx
         *      省份直辖市: provience-xxx
         *      动态load的城市列表: city-xxx
         */
        addClickType: function(){
            $('.hot-city [data-code]').each(function(i, el){
                var $el = $(el);
                $el.attr('click_type', 'hotcity-'+$el.attr('data-code'));
            });

            $('.area-line [data-code]').each(function(i, el){
                var $el = $(el);
                $el.attr('click_type', 'province-'+$el.attr('data-code'));
            });
        }
    };




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
        _view.init();
        _event.bind();
    }

    return {
        init: init
    };
});
