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

		//lft>rht ,return 1;
		function comparePrice(lft,rht){
			lft = (lft=='无限'?'10000':lft);
			rht = (rht=='无限'?'10000':rht);
			var l =  parseInt(lft.replace('万','')),
				r = parseInt(rht.replace('万',''));
			if(l>r)return 1;
			if(l<r)return -1;
			return 0;
		}
		function changePrice(min,max,priceArr){
			var len = priceArr.length;
			var realMin=priceArr[0] ,realMax=priceArr[len-1];
			for(var i=0;i<len;i++){
				if(comparePrice(min,priceArr[i])!=-1){
					realMin = priceArr[i];
					//break;
				}
			}
			for(var i = len-1;i>=0;i--){
				if(comparePrice(max,priceArr[i])!=1){
					realMax = priceArr[i];
					//break
				}
			}
			return {min:realMin,max:realMax};
		}
		
        return {

            init: function() {
                //init search option
                var minP = '8万',
                    maxP = '20万';
                if (dataObj.minPrice) {
                    minP = dataObj.minPrice + '万';
                }
                if (dataObj.maxPrice) {
                    maxP = dataObj.maxPrice + '万';
                    if (dataObj.maxPrice == '10000') maxP = '无限'
                }
                var yearCode = '';
                if (dataObj.year) {
                    yearCode = dataObj.year;
                }
                $('.year-item[data-code=' + yearCode + '] .text').addClass('selected');

				
				var priceArray = ["0万", "5万", "8万","10万","12万","15万", "18万", "20万", "25万", "30万", "35万", "40万", "50万", "60万", "80万", "无限"];
				var priceVal = changePrice(minP,maxP,priceArray);
                var range = new PriceRangeSlider({
                    ele: ".sc-rangeslider",
                    steps: ["0万", "5万", "8万","10万","12万","15万", "18万", "20万", "25万", "30万", "35万", "40万", "50万", "60万", "80万", "无限"],
                    min: priceVal.min,
                    max: priceVal.max,
                    tpl: "%"
                });
                //brand init
                var initBrands = {};
                if (dataObj.brands) {
					var bArr = dataObj.brands.split(',');
					for(var item in bArr){
						initBrands[item]='';
					}
                }

                var brandsManager = createBrandsManager($('.selected-brand'));

                var curPageIndex = 1;
                var pageStack = [];
                pageStack.push(0);
                var pages = [$('#page-1'), $('#page-2'), $('#page-3'), $('#page-4')];

				
				function beforePage(pageIndex){
					window.location.hash = 'page'+pageIndex;
					$('.submit-btn').removeAttr('click_type').attr('id','submit-btn-'+pageIndex);
                    if (pageIndex == 3) {
                        $('.submit-btn').text('完成定制').attr('click_type','H5_CUSTOM_ORDER').show();
                    } else if (pageIndex == 4) {
                        $('.submit-btn').hide();
                    } else {
                        $('.submit-btn').text('下一步').show();
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
					if (pageIndex == 0|| pageIndex==undefined) {
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
                    BrandAjaxUtil.getRecomBrands(function(data) {
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
                    var brandCode = $self.attr('data-code');
                    var text = $self.find('.brand-name').text();
                    var html = '<div class="sb-item" brand-code=' + brandCode + ' series-code=' + "" + '>' + '<span class="text">' + text + '</span>' + '<i class="close-icon"></i>' + '</div>';
                    //$(this).find('.text').toggleClass('selected');
                    brandsManager.toggleSeries(brandCode, '', [
                        $(html), $('#brand-icons-container .icon-item[data-code=' + brandCode + ']').find('.brand-wrapper')
                    ]);

                })

                var brandIndex = 0;

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
                    //var minPrice = $('.min-input').val().replace('万', '');
                    //var maxPrice = $('.max-input').val().replace('万', '');
                    if (maxPrice == '无限')
                        maxPrice = 10000;
                    var bStr = '',
                        sStr = '';
                    /*for (var brand in brands) {
                        for (var series in brands[brand]) {
                            if (series == '') {
                                bStr += ',' + brand
                            } else {
                                sStr += ',' + series;
                            }
                        }
                    }*/
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
                            series: '',
                            year: yearCode,
                            minPrice: minPrice,
                            maxPrice: maxPrice
                        },
                        success: function() {
                            setTimeout(function() {
								if(window.location.href.toString().toLowerCase().indexOf('from=sms') != - 1){
									window.location.href = contextPath + '/mobile/carcustom.html?from=sms';
								}else{
									window.location.href = contextPath + '/mobile/carcustom.html';
								}  
                            }, 500)
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


                $('.submit-btn').click(function() {
                    if (curPageIndex != 3) {
                        if (!brandLoaded && curPageIndex == 1) {
                            gotoPage();
                            loadAllBrands();
                            brandLoaded = true;
                        } else {
                            gotoPage()
                        }
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
                            $('#phone-popup').hide();
                            $('.cover-layer').addClass('hidden');
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