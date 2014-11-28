define(['lib/mustache', 'souche/range-slide'], function(Mustache, PriceRangeSlider) {
    var GuWen = (function() {
        function createBrandsManager(_container) {
            var container = _container;

            var brandsManager = {
                brands: {}, //{bCode:{sCode:$}}
                //sCode='' for 不限
                toggleSeries: function(bCode, sCode, jqObjArr) {
                    var brands = this.brands;
                    var bObj = brands[bCode] // = brands[bCode] || {};

                    if (bObj && bObj[sCode]) {
                        this.removeSeries(bCode, sCode);
                        if ($.isEmptyObject(brands)) {
                            container.hide();
                        }
                    } else {
                        if ($.isEmptyObject(brands)) {
                            container.show();
                        }
                        bObj = brands[bCode] = (brands[bCode] || {});
                        if (sCode == '') {
                            for (var i in bObj) {
                                this.removeSeries(bCode, i);
                            }
                        } else {
                            this.removeSeries(bCode, '');
                        }
                        this.addSeries(bCode, sCode, jqObjArr);

                    }
                },
                removeSeries: function(bCode, sCode) {
                    var bObj = this.brands[bCode];
                    if (!(sCode in bObj))
                        return;
                    var sObj = bObj[sCode];
                    sObj[0].remove();
                    sObj[1].removeClass('selected')
                    delete bObj[sCode];
                    if ($.isEmptyObject(bObj)) {
                        delete this.brands[bCode];
                    }
                },
                addSeries: function(bCode, sCode, jqObjArr) {
                    var brands = this.brands;
                    var bObj = brands[bCode] = (brands[bCode] || {})
                    bObj[sCode] = jqObjArr;
                    container.append(jqObjArr[0]);
                    jqObjArr[1].addClass('selected');
                }
            }
            return brandsManager;
        }

        return {

            init: function() {

                var range = new PriceRangeSlider({
                    ele: ".sc-rangeslider",
                    steps: ["0万", "3万", "5万", "6万", "7万", "8万", "9万", "10万", "12万", "14万", "15万", "16万", "18万", "20万", "22万", "24万", "25万", "30万", "35万", "40万", "50万", "60万", "70万", "100万", "无限"],
                    min: "8万",
                    max: "20万",
                    tpl: "%"
                });

                var brandsManager = createBrandsManager($('.selected-brand'));


                var brandsManager = createBrandsManager($('.selected-brand'));

                var curPageIndex = 1;
                var pageStack = [];
                pageStack.push(0);
                var pages = [$('#page-1'), $('#page-2'), $('#page-3'), $('#page-4')];

                function gotoPage(pageIndex) {


                    pageStack.push(curPageIndex);
                    pageIndex = pageIndex || (curPageIndex + 1);
                    document.body.scrollTop = 0;

                    if (pageIndex == 3) {
                        $('#submit-btn').text('完成定制').show();
                    } else if (pageIndex == 4) {
                        $('#submit-btn').hide();
                    } else {
                        $('#submit-btn').text('下一步').show();
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
                    if (pageIndex == 0) {
                        if (document.referrer.indexOf("souche") != -1) {
                            history.back();
                        } else {
                            window.location.href = 'index.html';
                        }
                        return;
                    }
                    if (pageIndex == 3) {
                        $('.next-btn').text('完成定制').show();
                    } else if (pageIndex == 4) {
                        $('.next-btn').hide();
                    } else {
                        $('.next-btn').text('下一步').show();
                    }
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

                //var allBrands = [];

                var brandLoaded = false;

                function loadAllBrands() {
                    loadingLayer.removeClass('hidden');
                    BrandAjaxUtil.getRecomBrands(function(data) {
                        var brands = data.brands;
                        var container = $('#brand-icons-container');
                        var start = '<div class="icon-group">',
                            end = '</div>',
                            html = '';
                        for (var i = 0; i < brands.length; i++) {
                            html += Mustache.render(tplBrand, {
                                'brand': brands[4 * i + j]
                            });
                            container.append(start + html + end);
                            html = '';
                        }
                    })
                }



                $('.next-btn').on('click', function() {
                    if (brandLoaded && curPageIndex == 1) {
                        loadAllBrands();
                    } else {
                        gotoPage()
                    }
                })
                var tplBrand = $('#tpl_brand').text(),
                    tplSeries = $('#tpl_series').text();

                var initNum = 11;

                function load11(brands) {
                    var start = '<div class="icon-group">',
                        end = '</div>',
                        html = '';
                    var bound;
                    var groupNum = Math.ceil(initNum / 4)
                    for (var i = 0; i < groupNum; i++) {
                        bound = Math.min(initNum - 4 * i, 4);
                        for (var j = 0; j < bound; j++) {
                            html += Mustache.render(tplBrand, {
                                'brand': brands[4 * i + j]
                            });
                        }
                        if (bound < 4) {
                            html += '<div class="icon-item-more">' + '<div id="more-brand">' + '<div class="more-circle">' + '<div class="more-inner-circle"></div>' + '<div class="more-inner-circle"></div>' + '<div class="more-inner-circle"></div>' + '</div>' + '<div class="text">更多</div>' + '</div>' + '</div>'
                        }

                        $('#brand-icons-container').append(start + html + end);

                        html = '';

                    }
                }

                $('#page-2 .next-btn').click(function() {
                    gotoPage();
                })

                $('.back-icon').click(function() {
                    backPage();
                })
                $('.selected-brand').on('click', '.sb-item', function() {
                    var $self = $(this)
                    var bCode = $self.attr('brand-code'),
                        sCode = $self.attr('series-code');
                    brandsManager.toggleSeries(bCode, sCode);
                });

                var $curBrandArray;
                var $curFold;
                var curBrandCode;
                var loadingLayer = $('.loading-cover-layer');

                $('#brand-icons-container').on('click', '.icon-item', function() {
                    var $self = $(this);
                    var curBrandCode = $self.attr('data-code');
                    var text = $self.find('.brand-name').text();
                    var html = '<div class="sb-item" brand-code=' + curBrandCode + ' series-code=' + "" + '>' + '<span class="text">' + text + '</span>' + '<i class="close-icon"></i>' + '</div>';
                    //$(this).find('.text').toggleClass('selected');
                    brandsManager.toggleSeries(curBrandCode, '', [
                        $(html), $('body')
                    ]);

                })


                function initDataObj() {
                    if (dataObj) {

                    }
                }
                /*$('#brand-icons-container').on('click', '.icon-item',
                    function() {
                        var $self = $(this);


                        var dataIndex = $self.attr('data-index')
                        var localFold = $self.siblings('.fold-series[data-index=' + dataIndex + ']');
                        var loaclBrandCode = $self.attr('data-code');
                        var brandName = $self.find('.brand-name').text();

                        if (localFold.length === 0) {
                            var start = '<div data-index="' + dataIndex + '" class="fold-series"><div class="wrapper">',
                                end = '</div></div>',
                                html = '';
                            loadingLayer.removeClass('hidden');
                            BrandAjaxUtil.getSeries(function(data) {
                                var codes = data.items;
                                var hasCreateMore = true;
                                var seriesNum = 0;
                                html = '<div data-code="" class="series-item"> <div data-brand-name="' + brandName + '" class="text">全部车系</div></div>'
                                for (var i in codes) {
                                    var b = codes[i];
                                    var name = i;
                                    for (var n = 0; n < b.length; n++) {
                                        var seriesCode = b[n].code;
                                        var seriesName = b[n].enName;

                                        if (seriesNum > 11) {
                                            if (hasCreateMore) {
                                                html += Mustache.render(tplSeries, {
                                                    'series': {
                                                        'seriesCode': '__more__',
                                                        'seriesName': '更多'
                                                    }
                                                });
                                                hasCreateMore = false;
                                            }
                                            html += Mustache.render(tplSeries, {
                                                'series': {
                                                    'seriesCode': seriesCode,
                                                    'seriesName': seriesName,
                                                    'display': 'none'
                                                }
                                            });
                                        } else {
                                            html += Mustache.render(tplSeries, {
                                                'series': {
                                                    'seriesCode': seriesCode,
                                                    'seriesName': seriesName
                                                }
                                            });
                                        }
                                        seriesNum++;
                                    }
                                }
                                $self.parent('.icon-group').append(start + html + end);
                                if (curBrandCode === loaclBrandCode) {
                                    $curFold.hide();
                                    $curBrandArray.hide();
                                    curBrandCode = '';
                                    return;
                                }
                                if ($curFold) {
                                    $curFold.hide();
                                    $curBrandArray.hide();
                                }
                                //click '更多'
                                if (!loaclBrandCode) {
                                    return;
                                }

                                curBrandCode = $self.attr('data-code');
                                $curFold = $self.siblings('.fold-series[data-index=' + dataIndex + ']');
                                $curBrandArray = $self.find('.brand-array');
                                $curFold.slideDown(500, function() {
                                    $curBrandArray.show();
                                });
                                loadingLayer.addClass('hidden');
                            }, loaclBrandCode);
                            return;
                        }

                        if (curBrandCode === loaclBrandCode) {
                            $curFold.hide();
                            $curBrandArray.hide();
                            curBrandCode = '';
                            return;
                        }
                        if ($curFold) {
                            $curFold.hide();
                            $curBrandArray.hide();
                        }
                        //click '更多'
                        if (!loaclBrandCode) {
                            return;
                        }

                        curBrandCode = $self.attr('data-code');
                        $curFold = localFold;
                        $curBrandArray = $self.find('.brand-array');
                        $curFold.slideDown(500, function() {
                            $curBrandArray.show();
                        });
                    })*/

                var brandIndex = 0;
                $('#brand-icons-container').one('click', '#more-brand', function() {
                    var start = '<div class="icon-group">',
                        end = '</div>',
                        html = '';
                    var bound;
                    var brands = allBrands;
                    var totalNum = brands.length;
                    console.log(totalNum);
                    //to replace .icon-item#more-brand;
                    var firstHtml = Mustache.render(tplBrand, {
                        'brand': brands[initNum]
                    });
                    var iconGroup = $(this).closest('.icon-group');
                    $(this).parent('.icon-item-more').remove();
                    iconGroup.append(firstHtml);

                    var groupNum = Math.ceil((totalNum) / 4);
                    var startGroupIndex = Math.ceil((initNum + 1) / 4);
                    for (var i = startGroupIndex; i < groupNum; i++) {
                        bound = Math.min(totalNum - 4 * i, 4);
                        for (var j = 0; j < bound; j++) {
                            html += Mustache.render(tplBrand, {
                                'brand': brands[4 * i + j]
                            });
                        }
                        $('#brand-icons-container').append(start + html + end);
                        html = '';
                    }

                });

                $('#brand-icons-container').on('click', '.series-item',
                    function() {
                        var $self = $(this);
                        var dIndex = $self.attr('data-index');
                        var sCode = $self.attr('data-code');
                        var textDiv = $self.find('.text');
                        //click 更多
                        if (sCode == '__more__') {
                            $self.siblings('.series-item').show();
                            $self.remove();
                            return;
                        }
                        var text
                        if (textDiv.attr('data-brand-name')) {
                            text = textDiv.attr('data-brand-name');
                        } else {
                            text = textDiv.text();
                        }
                        var html = '<div class="sb-item" brand-code=' + curBrandCode + ' series-code=' + sCode + '>' + '<span class="text">' + text + '</span>' + '<i class="close-icon"></i>' + '</div>';
                        //$(this).find('.text').toggleClass('selected');
                        brandsManager.toggleSeries(curBrandCode, sCode, [
                            $(html), textDiv
                        ]);
                    })


                var yearCode = '';
                $('.year-item').click(function() {
                    $('.year-item .text').removeClass('selected');
                    $(this).find('.text').addClass('selected')
                    yearCode = $(this).attr('data-code');
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
                        for (var series in brands[brand]) {
                            if (series == '') {
                                bStr += ',' + brand
                            } else {
                                sStr += ',' + series;
                            }
                        }
                    }
                    bStr = bStr.substring(1);
                    sStr = sStr.substring(1);
                    gotoPage();
                    $.ajax({
                        url: contextPath + '/mobile/carCustomAction/saveBuyInfo.json',
                        dataType: 'json',
                        data: {
                            brands: bStr,
                            series: sStr,
                            year: yearCode,
                            minPrice: minPrice,
                            maxPrice: maxPrice
                        },
                        success: function() {
                            window.location.href = contextPath + '/mobile/carcustom.html';
                        },
                        error: function() {
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


                $('#submit-btn').click(function() {
                    if (curPageIndex != 3) {
                        gotoPage();
                        return;
                    }
                    SM.checkPhoneExist(function(is_login) {
                        if (is_login) {
                            sumbitGuWenInfo();
                        } else {
                            showPopup();
                        }
                    })
                })

                var phoneReg = /^1[3458][0-9]{9}$/;
                $('#phone-form').submit(function(e) {
                    var phoneNum = $("#phone-num").val();
                    e.preventDefault();
                    if (!phoneReg.test(phoneNum)) {
                        alert('请输入正确的手机号码');
                    } else {
                        SM.PhoneRegister(phoneNum, function() {
                            sumbitGuWenInfo();
                        })
                    }
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
                $ellipsis = $('#page-4 .ellipsis');
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