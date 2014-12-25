/**
 * Created by zilong on 2014/6/12.
 */
define(['lib/mustache', 'mobile/common/BrandManager', 'mobile/guwen/addListener'], function(Mustache, brandManager, addListener) {

    var GuWen = (function() {
        function userTrack(userData) {
            var url = contextPath + '/pages/common/trackAction/set.json?platform=PLATFORM_H5';
            $.ajax({
                url: url,
                data: userData
            })
        }
        addListener(brandManager);
        return {

            init: function(dataObj) {
                userTrack({
                    typeid: 'TYPE_H5_PAGE_CONSULT_SETP0'
                });


                //init search option
                var minP = dataObj.minPrice,
                    maxP = dataObj.maxPrice;
//                if (dataObj.minPrice) {
//                    minP = dataObj.minPrice;
//                }
//                if (dataObj.maxPrice) {
//                    maxP = dataObj.maxPrice;
//                    if (dataObj.maxPrice == '10000') maxP = '不限'
//                }

                $('#low-price').val(minP)
                $('#high-price').val(maxP)

                var curPageIndex = 1;
                var pageStack = [];
                pageStack.push(0);
                var pages = [$('#page-1'), $('#page-2'), $('#page-3'), $('#page-4')];
                var stepRecords = [];
                stepRecords.push(1); //stepRecords[0] = 1;
                function beforePage(pageIndex) {
                    var pageStep = pageIndex - 1;
                    var trackData = {};
                    if (pageStep == 1) {
                        var min = $('#low-price').val(),
                            max = $('#high-price').val();
                        max = ((max == '不限') ? 10000 : max);
                        var minP = +min,
                            maxP = +max;
                        if (isNaN(minP) || isNaN(maxP)) {
                            alert('请输入合法的价格');
                            return false;
                        }
                        if (minP > maxP) {
                            var tmp = minP;
                            minP = maxP;
                            maxP = tmp;
                        }
                        if (!stepRecords[pageStep]) {
                            trackData = {
                                typeid: 'TYPE_H5_PAGE_CONSULT_SETP1',
                                car_price_min: minP,
                                car_price_max: maxP
                            }
                            userTrack(trackData);

                        }
                        userTrack(trackData);
                        stepRecords.push(pageStep);
                        //console.log(trackData);
                    } else if (pageStep == 2) {
                        if (!stepRecords[pageStep]) {
                            trackData = {
                                typeid: 'TYPE_H5_PAGE_CONSULT_SETP2',
                                car_brands: brandManager.brands.map(function(b) {
                                    return b['code'];
                                }).join(',')
                            }
                            userTrack(trackData);
                        }
                    } else if (pageStep == 3) {
                        if (!stepRecords[pageStep]) {
                            var sStr = brandManager.brands.map(function(b) {
                                return b['series'].map(function(s) {
                                    return s['code'];
                                }).join(',');
                            }).join(',');
                            trackData = {
                                typeid: 'TYPE_H5_PAGE_CONSULT_SETP3',
                                car_series: sStr
                            }
                        }
                    }
                    if (pageIndex == pages.length) {
                        $('#submit-btn').hide();
                    } else {
                        $('#submit-btn').show();
                    }
                    return true;
                }

                function gotoPage(pageIndex) {
                    pageStack.push(curPageIndex);
                    pageIndex = pageIndex || (curPageIndex + 1);
                    document.body.scrollTop = 0;

                    if (!beforePage(pageIndex)) {
                        return;
                    }
                    var $curPage = pages[curPageIndex - 1];
                    var $page = pages[pageIndex - 1];
                    $page.css({
                        left: '100%'
                    }).show();
                    $curPage.animate({
                        left: '-100%'
                    }, function() {
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
                    }, function() {
                        $curPage.hide();
                    });
                    $page.animate({
                        left: '0'
                    });
                    curPageIndex = pageIndex;
                }

                var sSeriesArr = dataObj.series ? dataObj.series.split(',') : [];
                var sBrandArr = dataObj.brands ? dataObj.brands.split(',') : [];
                window.seriesBrandMap = {}
                !function makeSeriesBrand() {
                    var key = '',
                        value = '';
                    for (var i = 0; i < sSeriesArr.length; i++) {
                        key = sSeriesArr[i];
                        seriesBrandMap[key] = '';
                    }
                }();


                ! function priceBuild() {
                    //10000 means no limit
                    var priceRange = [0, 5, 8, 10, 15, 20, 30, 50, 10000];
                    var low, high;
                    var begin = '<div class="qs-item">' + '<div class="card"></div>' + '<div class="price-value">'
                    var mid = '</div><div class="price-tag"><div class="value">';
                    var end = '万</div></div></div>';
                    var html = '';
                    for (var i = 0; i < priceRange.length - 1; i++) {
                        low = priceRange[i], high = priceRange[i + 1];
                        if (high == 10000) high = '∞'
                        html += begin + low + mid + low + '~' + high + end;
                    }
                    var quick_select = $('#price-quick-select');
                    html += '<div class="qs-item"><div id="limit-symbol">∞</div></div>'
                    quick_select.html(html);

                    var qsItems = quick_select.find('.qs-item');
                    var lowInput = $('#low-price'),
                        highInput = $('#high-price');
                    qsItems.each(function(index, item) {
                        var low = priceRange[index],
                            high = priceRange[index + 1] ;//== 10000 ? '不限' : priceRange[index + 1];
                        $(this).click(function() {
                            var self = $(this);
                            qsItems.removeClass('selected');
                            self.addClass('selected');
                            lowInput.val(low);
                            highInput.val(high);
                        })
                    })
                    $('.price-box').on('focus', function() {
                        qsItems.removeClass('selected');
                    })
                }();



                //var loadingLayer = $('.loading-cover-layer');
                var brandLoaded = false;
                ! function brandBuild() {
                    var tplBrand = $('#tpl_brand').text();
                    var initBrands = function() {
                        var initBrs = {};
                        if (dataObj.brands) {
                            //var bArr = dataObj.brands.split(',');
                            sBrandArr.forEach(function(item) {
                                initBrs[item] = '';
                            })
                        }
                        return initBrs;
                    }()
                    var sbMgr = {
                        selectedBrands: [],
                        setBrand: function(code, name) {
                            if (code in initBrands) {
                                this.selectedBrands.push({
                                    code: code,
                                    name: name
                                });
                            }
                        },
                        build: function() {
                            var sBrands = this.selectedBrands;
                            var b = null;
                            for (var i in sBrands) {
                                b = sBrands[i];
                                brandManager.addBrand(b.code, b.name);
                            }
                        }
                    };!function loadAllBrands() {
                            //loadingLayer.removeClass('hidden');
                            $.ajax({
                                url: contextPath + '/pages/dicAction/loadRootLevel.json',
                                dataType: "json",
                                data: {
                                    type: 'car-subdivision'
                                },
                                success: function(data) {
                                    var brands = data.items;
                                    var container = $('#brand-icons-container');
                                    var html = '',
                                        totalNum = brands.length;

                                    for (var i = 0; i < totalNum; i++) {
                                        var b = brands[i];
                                        var brandData = {
                                            brand: b.code,
                                            brandName: b.enName,
                                            picture: parsePic(b.extString)

                                        }
                                        html += Mustache.render(tplBrand, {
                                            'brand': brandData
                                        });
                                        sbMgr.setBrand(brandData['brand'], brandData['brandName']);
                                    }
                                    container.html(html);
                                    sbMgr.build();
                                    //loadingLayer.addClass('hidden');
                                }

                            })

                        }();

                    function parsePic(str) {
                        var props = str.substr(1, str.length - 2).split(',');
                        for (var i = 0; i < props.length; i++) {
                            var ps = props[i].split('=');
                            if (ps[0] == 'picture') {
                                return ps[1];
                            }
                        }
                    }
                }();

                $('.back-icon').click(function() {
                    backPage();
                })
                $('#selected-brand').on('click', '.sb-item', function() {
                    var $self = $(this);
                    //brand-code should be data-code
                    var code = $self.attr('data-code'),
                        name = $self.find('.text').text();
                    brandManager.removeBrand(code, name);
                });

                $('#brand-icons-container').on('click', '.icon-item', function() {
                    var $self = $(this);
                    var code = $self.attr('data-code');
                    var name = $self.find('.brand-name').text();
                    if ($self.hasClass('selected')) {
                        brandManager.removeBrand(code, name);
                    } else {
                        brandManager.addBrand(code, name);
                    }
                })

                $('#series-container').on('click', '.series-item', function() {
                    var self = $(this);
                    var bCode = self.closest('.content').attr('data-code');
                    var code = self.attr('data-code');
                    var name = self.text();
                    if (self.hasClass('selected')) {
                        brandManager.removeSeries(code, bCode)
                    } else {
                        brandManager.addSeries(code, name, bCode);
                    }
                })

                $('#series-container').on('click', '.series-buxian', function() {
                    var bCode = $(this).attr('data-code');
                    brandManager.noLimitSeries(bCode);
                })

                $('#selected-series').on('click', '.ss-item', function() {
                    var self = $(this);
                    var code = self.attr('data-code'),
                        bCode = self.attr('data-brand-code');
                    brandManager.removeSeries(code, bCode);
                })

                function buildBsQueryString() {
                    var brands = brandManager.brands;
                    var bStr = brands.map(function(b) {
                        return b['code'];
                    }).join(',')

                    var sStr = brands.map(function(b) {
                        return b['series'].map(function(s) {
                            return s['code'];
                        }).join(',');
                    }).join(',');
                    return {
                        brandStr: bStr,
                        seriesStr: sStr
                    }
                }

                function submitGuWenInfo() {
                    var minPrice = $('#low-price').val().trim(),
                        maxPrice = $('#high-price').val().trim();

                    if (maxPrice == '不限')
                        maxPrice = 10000;
                    var bStr = '',
                        sStr = '';

                    var bs = buildBsQueryString();
                    var bStr = bs.brandStr,
                        sStr = bs.seriesStr;
                    //gotoPage();
                    $.ajax({
                        url: contextPath + '/mobile/carCustomAction/saveBuyInfo.json',
                        dataType: 'json',
                        data: {
                            brands: bStr,
                            series: sStr,
                            minPrice: minPrice,
                            maxPrice: maxPrice
                        },
                        success: function() {

                            SM.checkPhoneExist(function(is_login) {
                                if (is_login) {
                                    setTimeout(function() {
                                        window.location.href = 'index.html' + location.search;
                                    }, 50)
                                } else {
                                    $('.wrapGrayBg').removeClass('hidden');
                                    var $popup = $('.login-popup');
                                    $popup.removeClass('hidden');
                                    $('.e-close-btn').on('click', function() {
                                        window.location.href = 'index.html' + location.search;
                                    });
                                }
                            });                          
                        }

                    });
                }

                function showLoading(){

                }

                $('#login-form').submit(function(e) {
                    var phoneReg = /^1[3458][0-9]{9}$/;
                    var phoneNum = $("#phone-for-login").val();
                    e.preventDefault();
                    if (!phoneReg.test(phoneNum)) {
                        alert('请输入正确的手机号码');
                    } else {
                        SM.PhoneRegister(phoneNum, function() {
                            window.location.href = 'index.html' + location.search;
                        })
                    }
                });



                $('#submit-btn').click(function() {
                    if (curPageIndex == pages.length - 1) {
                        //gotoPage()
                        submitGuWenInfo();
                        return;
                    }
                    if (curPageIndex == 2 && brandManager.brands.length == 0) {
                        //gotoPage(4)
                        submitGuWenInfo();
                        return;
                    }
                    gotoPage();
                    //TODO
                })

                $('.search-icon').click(function() {
                    var $icon2 = $(this).siblings('.search-icon-2');
                    $(this).parent().siblings('.search-box').show();
                    $(this).hide();
                    $icon2.show();
                })

                $('.search-icon-2').click(function() {
                    var $icon = $(this).siblings('.search-icon');
                    $(this).parent().siblings('.search-box').hide();
                    $(this).hide();
                    $icon.show();
                })

                $('.cancel-icon').click(function(e) {
                    var $input = $(this).siblings('input[name=keyword]');
                    $input.val('');
                    $input.focus();
                })

                $('.search-form').submit(function(e) {
                    var $input = $(this).find('input[name=keyword]');
                    if ($input.val().trim() == '') {
                        $input.val('');
                        e.preventDefault();
                    }
                })

                $('.search-btn').click(function(e) {
                    var $input = $(this).siblings('.input').find('input[name=keyword]');
                    if ($input.val().trim() == '') {
                        $input.val('');
                    } else {
                        $input.parent().submit();
                    }
                });

                var curNumOfEllipsis = 1;
                $ellipsis = $('.ellipsis');
                setInterval(function() {
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