var List = function() {
    var config = {
        page: 1,
        moreURL: ""
    }
    var tpl_cars;
    var carList = [];
    var loadMore = function() {
        $("#load_more").text('加载中...')
        $.ajax({
            url: config.moreURL + "&index=" + (++config.page),
            dataType: "json",
            success: function(data) {
                //console.log(data)
                var items = data.items;
                var tpl_data, item, html;
                var $cars = $('.cars')
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    tpl_data = {
                        id: item.id,
                        detailUrl: item.carVo.status == 'zaishou' ? 'detail' : 'yushou-detail',
                        flashPurchase: item.flashPurchase,
                        fenqi: ( !! item.carPriceVO && item.carPriceVO.fenqi == 1),
                        downPrice: ( !! item.flashPurchaseVO) ? item.flashPurchaseVO.totalMasterOutPriceToString * 1000 : undefined,
                        favorite: item.favorite,
                        favCount: item.count,
                        year: item.carVo.yearShow,
                        month: item.carVo.monthShow,
                        newPrice: item.carVo.newPriceToString,
                        levelName: item.carVo.levelName,
                        pictureBig: ( !! item.carPicturesVO)?item.carPicturesVO.pictureBig:'',
                        carOtherAllNameShow: item.carVo.carOtherAllNameShow,
                        price: item.price,
                        zaishou: (item.carVo.status == 'zaishou'),
                        carOtherAllName:item.carVo.carOtherAllName,
                        carShortName:item.carVo.carShortName,
                        modelName:item.carVo.simpleModelName
                    }
                    carList.push(tpl_data);
                    html = Mustache.render(tpl_cars, {
                        'cars': tpl_data
                    });
                    $cars.append(html);
                }
                $("#load_more").text('点击查看更多')
                if (data.totalPage == config.page) {
                    $("#load_more").addClass("hidden")
                }
            }
        })
    }

    var storeStorage = function() {
        var db = window.sessionStorage;
        db.setItem('timestamp', Date.now());
        db.setItem('url', window.location.href);
        db.setItem('carlist', JSON.stringify(carList));
        db.setItem('page', config.page);
    }

    var backRecover = function() {
        var db = window.sessionStorage;
        var time = parseInt(db.getItem('timestamp'));
        var url = db.getItem('url');

        if (!checkCond({
            time: time,
            url: url
        })) {
            db.setItem('carlist', '');
            db.setItem('page', '');
            return;
        }

        carList = JSON.parse(db.getItem('carlist'));
        config.page = db.getItem('page') ? db.getItem('page') : 1
        makeDom(carList);
    }

    var makeDom = function(carList) {
        var $cars = $('.cars');
        var html;
        for (var i = 0; i < carList.length; i++) {
            html = Mustache.render(tpl_cars, {
                'cars': carList[i]
            });
            $cars.append(html);
        }
    }
    var checkCond = function(obj) {
        var time = obj.time,
            url = obj.url;

        //10 minutes 1000*60*10
        if (!time || (Date.now() - time > 600000)) {
            return false;
        }
        if (!url || (url != window.location.href)) {
            return false;
        }
        return true;
    }


    return {

        init: function(_config) {
            for (var i in _config) {
                config[i] = _config[i]
            }
            tpl_cars = $("#tpl_cars").html();
            try {
                //无痕模式可能报错
                backRecover();
            }catch(e){}
            this.bind()
        },
        bind: function() {
            $("#list .filter .t").on("click", function(e) {
                setTimeout(function() {
                    $("#content").css("height", 0)
                }, 400)
                $("#filter").animate({
                    left: 0
                }, 300)
                $("html,body").scrollTop(0)
                // $("#filter .action").css({
                //         top:$(window).height()+$(window).scrollTop()-70
                //     })
                window.history.pushState({
                    time: new Date().getTime()
                }, "", window.location.href.replace(/#filter/g, "") + "#filter");
                $("#xuan").addClass("hidden")

            })

            $("#load_more").on("click", function(e) {
                e.preventDefault();
                loadMore();
            })


            $('#cars').on('click', 'a.car', function(e) {
                e.preventDefault();
                try{
                    storeStorage();
                }catch(e){}
                window.location.href = $(this).attr('href');
            })

            $('.wrapPhoneBg').click(function() {
                $(this).addClass('hidden');
                $('#phone-popup').addClass('hidden')
            })
            //do fav
            ! function() {
                var api = {
                    fav: WebPre + '/favSaleCar.jsonp',
                    unfav: WebPre + '/favSaleCar.jsonp'
                };

                function showPopup() {
                    $('.wrapPhoneBg').removeClass('hidden');
                    var $popup = $('#phone-popup');
                    $popup.removeClass('hidden').css({
                        top: $(window).scrollTop()+50
                    });

                }

                function hidePopup() {
                    $('.wrapPhoneBg').addClass('hidden');
                    $('#phone-popup').addClass('hidden');
                }

                function saveFav($node) {
                    var $node = $node;
                    $.ajax({
                        url: api.fav,
                        data: {
                            carId: $node.attr("data-id"),
                            platform : 'PLATFORM_H5',
                            crmUserId: $.cookie("crmUserId"),
                            siteId:$.cookie("siteId")
                        },
                        dataType: "jsonp",
                        success: function() {
                            $node.addClass("star");
                            var $numSpan = $node.find('span');
                            var i = parseInt($numSpan.text());
                            $numSpan.text(i + 1);
                        }
                    })
                }

                function delFav($node) {
                    $.ajax({
                        url: api.unfav,
                        data: {
                            'carId': $node.attr("data-id"),
                            platform : 'PLATFORM_H5'
                        },
                        dataType: "json",
                        success: function() {
                            $node.removeClass("star");
                            var $numSpan = $node.find('span');
                            var i = parseInt($numSpan.text());
                            $numSpan.text(i - 1);
                        }
                    })
                }

                function doFav($node) {
                    if ($node.hasClass('star')) {
                        delFav($curFav);
                    } else {
                        saveFav($curFav);
                    }
                }

                var isLogin = false;
                var $curFav;
                var phoneReg = /^1[3458][0-9]{9}$/;
                $('#fav-form').submit(function(e) {
                    var phoneNum = $("#phone-for-fav").val();
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

                $('#back-btn').click(function() {
                    hidePopup();
                })
                $('.cars').on('click', '.fav', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $curFav = $(this);

                    if (isLogin) {
                        doFav($curFav);
                        return;
                    }

                    SM.checkPhoneExist(function(is_login) {
                        if (is_login) {
                            doFav($curFav);
                        } else {
                            showPopup()
                        }
                    })
                })
            }();
            //do fav end

        }

    }
}();
