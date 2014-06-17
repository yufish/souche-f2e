/**
 * Created by zilong on 2014/6/12.
 */
define(['lib/mustache', 'mobile/common/BrandManager','mobile/guwen/addListener'], function (Mustache,brandManager,addListener) {

    var GuWen =(function(){
        function userTrack(userData) {
            var url = contextPath + '/pages/common/trackAction/set.json?platform=PLATFORM_H5';
            $.ajax({
                url: url,
                data: userData
            })
        }

        addListener(brandManager);
        return {

            init: function (dataObj) {
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

                var queryObject={
                     minPrice:minP,
                     maxPrice:maxP
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
                            //TODO
                            var min=$('#low-price').val(),
                                max = $('#high-price').val();

                            trackData = {
                                typeid: 'TYPE_H5_PAGE_CONSULT_SETP1',
                                car_price_min:min,
                                car_price_max: max
                            }
                            //userTrack(trackData);

                        } else if (pageStep == 2) {

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
                        $('#submit-btn').hide();
                    } else {
                        $('#submit-btn').show();
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

                //brand-code should be data-code
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

                !function priceBuild(){
                    //10000 means no limit
                    var priceRange=[0,5,8,10,15,20,30,50,10000];
                    var low,high;
                    var begin = '<div class="qs-item">'
                                +   '<div class="card"></div>'
                                +   '<div class="price-value">'
                    var mid = '</div><div class="price-tag"><span class="value">';
                    var end = '</span><i></i></div></div>';
                    var html = '';
                    for(var i=0;i<priceRange.length-1;i++){
                        low = priceRange[i],high= priceRange[i+1];
                        if(high==10000)high='∞'
                        html+=begin+low+mid+low+'~'+high+end;
                    }
                    var quick_select = $('#price-quick-select');
                    html+='<div class="qs-item"><div id="limit-symbol">∞</div></div>'
                    quick_select.html(html);

                    var qsItems = quick_select.find('.qs-item');
                    var lowInput = $('#low-price'),
                        highInput = $('#high-price');
                    qsItems.each(function(index,item){
                        var low = priceRange[index],
                            high = priceRange[index+1]==10000?'不限':priceRange[index+1];
                        $(this).click(function(){
                            qsItems.removeClass('selected');
                            $(this).addClass('selected');
                            lowInput.val(low);
                            highInput.val(high);
                        })
                    })

                }();

                var loadingLayer = $('.loading-cover-layer');
                !function brandBuild(){
                    var tplBrand = $('#tpl_brand').text();
                    !function loadAllBrands() {
                        //loadingLayer.removeClass('hidden');
                        BrandAjaxUtil.getRecomBrands(function (data) {
                            var brands = data.brands;
                            var container = $('#brand-icons-container');
                            var start = '<div class="icon-group">',
                                end = '</div>',
                                html = '',
                                totalNum = brands.length;

                            for(var i= 0;i<totalNum;i++){
                                var b = brands[i];
                                html += Mustache.render(tplBrand, {'brand': b});
                            }
                            $('#brand-icons-container').html(html);
                            loadingLayer.addClass('hidden');
                            brandLoaded=true;
                        })
                    }();
                }();


                var tplSeries = $('#tpl_series').text();

                $('.back-icon').click(function () {
                    backPage();
                })
                $('#selected-brand').on('click', '.sb-item', function () {
                    var $self = $(this)
                    //brand-code should be data-code
                    var code = $self.attr('data-code'),
                        name=$self.find('.text').text();
                    brandManager.removeBrand(code,name);
                });

                $('#brand-icons-container').on('click', '.icon-item', function () {
                    var $self = $(this);
                    var code = $self.attr('data-code');
                    var name = $self.find('.brand-name').text();
                    if($self.hasClass('selected')) {
                        brandManager.removeBrand(code, name);
                    }else{
                        brandManager.addBrand(code, name);
                    }

                })

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


                $('#submit-btn').click(function () {
                    if (curPageIndex != pages.length - 1) {
                        if (!brandLoaded && curPageIndex == 1) {
                            gotoPage();
                            loadingLayer.removeClass('hidden');
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
