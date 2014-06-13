/**
 * Created by zilong on 2014/6/12.
 */
define(['lib/mustache', 'mobile/common/cookieUtil'], function (Mustache) {

    var GuWen =(function(){


    //lft>rht ,return 1;
        function comparePrice(lft, rht) {
            lft = (lft == '无限' ? '10000' : lft);
            rht = (rht == '无限' ? '10000' : rht);
            var l = parseInt(lft.replace('万', '')),
                r = parseInt(rht.replace('万', ''));
            if (l > r) return 1;
            if (l < r) return -1;
            return 0;
        }

        function changePrice(min, max, priceArr) {
            var len = priceArr.length;
            var realMin = priceArr[0],
                realMax = priceArr[len - 1];
            for (var i = 0; i < len; i++) {
                if (comparePrice(min, priceArr[i]) != -1) {
                    realMin = priceArr[i];
                    //break;
                }
            }
            for (var i = len - 1; i >= 0; i--) {
                if (comparePrice(max, priceArr[i]) != 1) {
                    realMax = priceArr[i];
                    //break
                }
            }
            return {
                min: realMin,
                max: realMax
            };
        }

//        function test_AB() {
//            cookieUtil.update();
//            var tag = cookieUtil.getCookie('usertag');
//            var lastCode = tag.charCodeAt(tag.length - 1);
//            return lastCode % 2;
//        }
        //'0' means: has yearCode
        //'1' no
        //var tagNum = test_AB();
        //var taskStr = (tagNum == 0 ? 'TASK_H5_CONSULT_1' : 'TASK_H5_CONSULT_2');

        function userTrack(userData) {
            var url = contextPath + '/pages/common/trackAction/set.json?platform=PLATFORM_H5';
            //userData['taskId'] = taskStr,
            //userData['ua'] = navigator.userAgent,
            $.ajax({
                url: url,
                data: userData
            })
        }

//        function mapYearCode(originYear){
//            var year = originYear.substring(0,4);
//            return year+'-2014'
//        }

        function recoverData(){

        }

        return {

            init: function (dataObj) {
                //change demand,ugly fixed
                userTrack({
                    typeid: 'TYPE_H5_PAGE_CONSULT_SETP0'
                });

                var stepRecords = [];
                stepRecords.push(1);
                //init search option
                var minP = '8',
                    maxP = '20';
                if (dataObj.minPrice) {
                    minP = dataObj.minPrice;
                }
                if (dataObj.maxPrice) {
                    maxP = dataObj.maxPrice;
                    if (dataObj.maxPrice == '10000') maxP = '不限'
                }



                //var priceArray = ["0万", "5万", "8万", "10万", "12万", "15万", "18万", "20万", "25万", "30万", "35万", "40万", "50万", "60万", "80万", "无限"];
                //var priceVal = changePrice(minP, maxP, priceArray);

                //brand init
                var queryObject={
                    price:{
                        min:minP,
                        max:maxP
                    }
                }
                var initBrands = function(){
                    var initBrs = {};
                    if (dataObj.brands) {
                        var bArr = dataObj.brands.split(',');
                        for (var item in bArr) {
                            initBrs[bArr[item]] = '';
                        }
                    }
                    return initBrs;
                }()



                var curPageIndex = 1;
                var pageStack = [];
                pageStack.push(0);


                var pages = [$('#page-1'), $('#page-2'), $('#page-3'), $('#page-4')];
//                if (tagNum == 1) {
//                    pages = [$('#page-1'), $('#page-2'), $('#page-4')];
//                }

                function beforePage(pageIndex) {
                    var pageStep = pageIndex - 1;
                    var trackData = {};
                    if (!stepRecords[pageStep]) {
                        if (pageStep == 1) {
                            var price = range.getData();
                            trackData = {
                                typeid: 'TYPE_H5_PAGE_CONSULT_SETP1',
                                car_price_min: price.min.value.replace('万', ''),
                                car_price_max: price.max.value.replace('万', '')
                            }
                            //userTrack(trackData);

                        } else if (pageStep == 2) {
                            var brands = brandsManager.brands;
                            var bStr = '';
                            for (var brand in brands) {
                                bStr += ',' + brand;
                            }
                            bStr = bStr.substring(1);
                            trackData = {
                                typeid: 'TYPE_H5_PAGE_CONSULT_SETP2',
                                car_brands: bStr
                            }
                        } else if (pageStep == 3) {

                            trackData = {
                                typeid: 'TYPE_H5_PAGE_CONSULT_SETP3',
                                car_year_min: min_year,
                                car_year_max: max_year
                            }
                        }
                        userTrack(trackData);
                        stepRecords.push(pageStep);
                        //console.log(trackData);
                    }


                    if (pageIndex == pages.length) {
                        $('.submit-btn').hide();
                    } else {
                        $('.submit-btn').show();
                    }

                }

                function gotoPage(pageIndex) {
                    pageStack.push(curPageIndex);
                    pageIndex = pageIndex || (curPageIndex + 1);
                    document.body.scrollTop = 0;

                    beforePage(pageIndex);
                    var $curPage = pages[curPageIndex - 1];
                    var $page = pages[pageIndex - 1];
                    $page.css({
                        left: '100%'
                    }).show();
                    $curPage.animate({
                        left: '-100%'
                    }, function () {
                        $curPage.hide();
                    });
                    $page.animate({
                        left: '0'
                    });
                    curPageIndex = pageIndex;
                }

                function backPage() {
                    document.body.scrollTop = 0
                    var pageIndex = pageStack.pop();
                    if (pageIndex == 0 || pageIndex == undefined) {
                        //特殊需求，动画只看一次
                        if (document.referrer.indexOf("animation") != -1) {
                            window.location.href = 'index.html';
                            return;
                        }

                        if (document.referrer.indexOf("souche") != -1) {
                            history.back();
                        } else {
                            window.location.href = 'index.html';
                        }
                        return;
                    }
                    beforePage(pageIndex);
                    var $curPage = pages[curPageIndex - 1];
                    var $page = pages[pageIndex - 1];
                    $page.css({
                        left: '-100%'
                    }).show();
                    $curPage.animate({
                        left: '100%'
                    }, function () {
                        $curPage.hide();
                    });
                    $page.animate({
                        left: '0'
                    });
                    curPageIndex = pageIndex;
                }

                //var allBrands = [];

                var brandLoaded = false;

                function initializeBrands() {
                    for (var key in initBrands) {
                        var brandCode = key,
                            brandName = initBrands[key];
                        var html = '<div class="sb-item" brand-code=' + brandCode + ' series-code=' + "" + '>' + '<span class="text">' + brandName + '</span>' + '<i class="close-icon"></i>' + '</div>';
                        brandsManager.toggleSeries(brandCode, '', [
                            $(html), $('#brand-icons-container .icon-item[data-code=' + brandCode + ']').find('.brand-wrapper')
                        ]);
                    }
                }


                function makeBrandPair(brand) {
                    if (brand.brand in initBrands) {
                        initBrands[brand.brand] = brand['brandName'];
                    }
                }

                function loadAllBrands() {
                    loadingLayer.removeClass('hidden');
                    BrandAjaxUtil.getRecomBrands(function (data) {
                        var brands = data.brands;
                        var container = $('#brand-icons-container');
                        var start = '<div class="icon-group">',
                            end = '</div>',
                            html = '',
                            bound;
                        var totalNum = brands.length;
                        var groupNum = Math.ceil(totalNum / 4);
                        var tmpBrand;
                        for (var i = 0; i < groupNum; i++) {
                            bound = Math.min(totalNum - 4 * i, 4);
                            for (var j = 0; j < bound; j++) {
                                tmpBrand = brands[4 * i + j];

                                makeBrandPair(tmpBrand);

                                html += Mustache.render(tplBrand, {
                                    'brand': tmpBrand
                                });
                            }
                            $('#brand-icons-container').append(start + html + end);

                            html = '';

                        }
                        initializeBrands();
                        loadingLayer.addClass('hidden');
                    })
                }

                var tplBrand = $('#tpl_brand').text(),
                    tplSeries = $('#tpl_series').text();


                $('.back-icon').click(function () {
                    backPage();
                })
                $('.selected-brand').on('click', '.sb-item', function () {
                    var $self = $(this)
                    var bCode = $self.attr('brand-code'),
                        sCode = $self.attr('series-code');
                    brandsManager.toggleSeries(bCode, sCode);
                });

                var qsItems = $('#price-quick-select .qs-item');
                qsItems.click(function(){
                    qsItems.removeClass('selected');
                    $(this).addClass('selected');
                })

                var $curBrandArray;
                var $curFold;
                var curBrandCode;
                var loadingLayer = $('.loading-cover-layer');

                $('#brand-icons-container').on('click', '.icon-item', function () {
                    var $self = $(this);
                    var brandCode = $self.attr('data-code');
                    var text = $self.find('.brand-name').text();
                    var html = '<div class="sb-item" brand-code=' + brandCode + ' series-code=' + "" + '>' + '<span class="text">' + text + '</span>' + '<i class="close-icon"></i>' + '</div>';
                    //$(this).find('.text').toggleClass('selected');
                    brandsManager.toggleSeries(brandCode, '', [
                        $(html), $('#brand-icons-container .icon-item[data-code=' + brandCode + ']').find('.brand-wrapper')
                    ]);

                })

                var brandIndex = 0;



                function sumbitGuWenInfo() {
                    var price = range.getData();
                    var brands = brandsManager.brands;
                    var minPrice = price.min.value.replace('万', ''),
                        maxPrice = price.max.value.replace('万', '');

                    if (maxPrice == '无限')
                        maxPrice = 10000;
                    var bStr = '',
                        sStr = '';

                    for (var brand in brands) {
                        bStr += ',' + brand;
                    }
                    bStr = bStr.substring(1);
                    //sStr = sStr.substring(1);
                    sStr = dataObj.series;
                    gotoPage();
                    $.ajax({
                        url: contextPath + '/mobile/carCustomAction/saveBuyInfo.json',
                        dataType: 'json',
                        data: {
                            brands: bStr,
                            //series: '',

                            minPrice: minPrice,
                            maxPrice: maxPrice
                            //taskId: (tagNum == 0 ? 'TASK_H5_CONSULT_1' : 'TASK_H5_CONSULT_2')
                        },
                        success: function () {
                            setTimeout(function () {
                                window.location.href = contextPath + '/mobile/carcustom.html' + location.search;
                            }, 500)
                        },
                        error: function () {
                            alert('error');
                        }
                    });
                }

                function showPopup() {
                    $('.cover-layer').removeClass('hidden');
                    var width = $(window).width();
                    var left = (width - 300) / 2;
                    $('#phone-popup').css({
                        'left': left
                    }).removeClass('hidden');
                }


                $('.submit-btn').click(function () {
                    if (curPageIndex != pages.length - 1) {
                        if (!brandLoaded && curPageIndex == 1) {
                            gotoPage();
                            loadAllBrands();
                            brandLoaded = true;
                        } else {
                            gotoPage()
                        }
                        return;
                    }
                    sumbitGuWenInfo();
                })

                var phoneReg = /^1[3458][0-9]{9}$/;
                $('#phone-form').submit(function (e) {
                    var phoneNum = $("#phone-num").val();
                    e.preventDefault();
                    if (!phoneReg.test(phoneNum)) {
                        alert('请输入正确的手机号码');
                    } else {
                        SM.PhoneRegister(phoneNum, function () {
                            $('#phone-popup').hide();
                            $('.cover-layer').addClass('hidden');
                            sumbitGuWenInfo();
                        })
                    }
                })

                $('.search-icon').click(function () {
                    var $icon2 = $(this).siblings('.search-icon-2');
                    $(this).parent().siblings('.search-box').show();
                    $(this).hide();
                    $icon2.show();
                })

                $('.search-icon-2').click(function () {
                    var $icon = $(this).siblings('.search-icon');
                    $(this).parent().siblings('.search-box').hide();
                    $(this).hide();
                    $icon.show();
                })

                $('.cancel-icon').click(function (e) {
                    var $input = $(this).siblings('input[name=keyword]');
                    $input.val('');
                    $input.focus();
                })

                $('.search-form').submit(function (e) {
                    var $input = $(this).find('input[name=keyword]');
                    if ($input.val().trim() == '') {
                        $input.val('');
                        e.preventDefault();
                    }
                })

                $('.search-btn').click(function (e) {
                    var $input = $(this).siblings('.input').find('input[name=keyword]');
                    if ($input.val().trim() == '') {
                        $input.val('');
                    } else {
                        $input.parent().submit();
                    }
                });

                var curNumOfEllipsis = 1;
                $ellipsis = $('#page-3 .ellipsis');
                setInterval(function () {
                    var txt = '';
                    for (var i = 0; i < curNumOfEllipsis; i++) {
                        txt += '.'
                    }
                    $ellipsis.text(txt);
                    if (curNumOfEllipsis == 3) {
                        curNumOfEllipsis = 1;
                    } else {
                        curNumOfEllipsis++;
                    }

                }, 500)

            }
        }
    })();
    //window.GuWen = GuWen;
    return GuWen;
});
