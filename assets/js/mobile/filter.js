! function ($) {

    var hotBrands_g = {
        "brand-15": "奥迪",
        "brand-20": "宝马",
        "brand-25": "奔驰",
        "brand-27": "本田",
        "brand-29": "标致",
        "brand-30": "别克",
        "brand-41": "大众",
        "brand-49": "丰田",
        "brand-53": "福特",
        "brand-99": "路虎",
        "brand-102": "马自达",
        "brand-108": "迷你",
        "brand-119": "起亚",
        "brand-121": "日产",
        "brand-134": "斯巴鲁",
        "brand-135": "斯柯达",
        "brand-146": "沃尔沃",
        "brand-151": "现代",
        "brand-154": "雪佛兰",
        "brand-155": "雪铁龙"
    };

    var prices = [5, 8, 12, 16, 20, 25, 50, 70, 100];

    function makeBrands(brands) {
        var b, otherBrandsStr = '';
        var brandList = $('#brand-list');

        var $otherCtn = brandList.find('#other-brands-select');
        for (var i = 0; i < brands.length; i++) {
            b = brands[i];
            if (!hotBrands_g[b.code]) {
                otherBrandsStr += '<option value="' + b.code + '">' + b.enName + '</option>';
            }
        }
        $otherCtn.append(otherBrandsStr);
    }

    function makeSeries(codes) {
        var start = '<div class="clearfix">',
            end = '</div>';
        var html = '';

        for (var i in codes) {
            html += start;
            html += '<div class="series-title"><span class = "text" >' + i + '</span></div >'
            var s = codes[i];
            for (var j in s) {
                var b = s[j];
                html += '<div data-code="' + b.code + '"class="series-name">' + b.name + '</div>';
            }
            html += end;
        }
        $('#series-list .content').append(html);
    }

    function showPopup_b() {
        $('.wrapGrayBg').removeClass('hidden');
        var $win = $(window);
        var winW = $win.width(),
            scrollTop = $win.scrollTop();
        $('#brand-wrapper').css({
            width: winW - 20,
            top: scrollTop + 50,
        }).removeClass('hidden');

    }

    function showPopup_s() {
        $('.wrapGrayBg').removeClass('hidden');
        var $win = $(window);
        var winW = $win.width(),
            scrollTop = $win.scrollTop();
        $('#series-wrapper').css({
            width: winW - 20,
            top: scrollTop + 50,
        }).removeClass('hidden');

    }
    var selectedBrand = '';
    var selectedSeries = '';
    var selectedBrandName = '';
    var selectedSeriesName = '';
    var brandLoaded = false;
    $('#btn-select-brand').click(function () {
        showPopup_b();

        if (!brandLoaded) {
            //add hotbrand first;
            var b, hotBrandsStr = '';
            var $hotCtn = $('#brand-list #hot-brands');
            for (var i in hotBrands_g) {
                hotBrandsStr += '<div data-code = "' + i + '"class = "item col-1-4">' + hotBrands_g[i] + ' </div>';
            }
            $hotCtn.append(hotBrandsStr);

            $.ajax({
                url: contextPath + "/pages/dicAction/loadAllExistBrands.json",
                dataType: "json ",
                success: function (data) {
                    makeBrands(data.items);
                    brandLoaded = true;
                }
            })
        }
    })

    $('#btn-select-series').click(function () {
        var $self = $(this);
        if (selectedBrand == '') {
            $self.text('请先选择品牌 ↑').css({
                color: '#f00'
            });
            return;
        }

        if ($self.attr('data-brand') != selectedBrand) {
            $('#series-wrapper .content').empty();
            $.ajax({
                url: contextPath + "/pages/dicAction/loadExistSeries.json",
                dataType: "json",
                data: {
                    type: "car-subdivision",
                    code: selectedBrand
                },
                success: function (data) {
                    makeSeries(data.codes);
                }
            })
        }
        showPopup_s();
    })

    function setBrands(code, name) {
        if (selectedBrand != code) {
            $('#btn-select-series').css({
                color: '#999'
            }).text('选择车系');
            selectedSeries = '';
        }
        selectedBrand = code;
        selectedBrandName = name;
        //重置所有与品牌有个的界面设置； 调用本方法的函数，要在后面自己设置选择状态
        $('#btn-select-brand').text(name).css({
            color: '#000'
        });
        var $other = $('#other-brands-select').css({
            color: '#999'
        })
        $other.find('option').removeAttr('selected');
        $other.find('.placeholder-option').attr('selected', 'selected');
        $('#brand-wrapper').addClass('hidden');
        $('#series-list .title').text(name);
        $('.wrapGrayBg').addClass('hidden');
        $('#hot-brands .item').removeClass('selected');
    }

    function setSeries(code, name) {
        selectedSeries = code;
        selectedSeriesName = name;
        $('#btn-select-series').text(name).attr('data-brand', selectedBrand).css({
            color: '#000'
        });
        $('#series-wrapper').addClass('hidden');
        $('.wrapGrayBg').addClass('hidden');
        $('#series-wrapper .series-name').removeClass('selected');
    }
    $('#series-wrapper').on('click', '.series-name', function () {
        var $self = $(this);
        var code = $self.attr('data-code');
        var name = $self.text();
        setSeries(code, name);
        $self.addClass('selected');
    })

    $('#hot-brands').on('click', '.item', function () {
        var $self = $(this);
        var code = $self.attr('data-code');
        var name = $self.text();
        setBrands(code, name);
        $self.addClass('selected');
    });
    $('#other-brands-select').change(function () {
        var $self = $(this);
        var code = $self.val();
        var $selectedOpt = $self.find('option:selected')
        var name = $selectedOpt.text();

        setBrands(code, name);
        $self.css({
            color: '#000'
        });
        $self.find('option').removeAttr('selected');
        $selectedOpt.attr('selected', 'selected');
    })


    $('#option-advance').click(function () {
        var $self = $(this);
        if ($self.hasClass('reverse')) {
            $self.removeClass('reverse');
            $('#option-advance-show').addClass('hidden');
        } else {
            $self.addClass('reverse');
            $('#option-advance-show').removeClass('hidden');
        }
    });

    $('.wrapGrayBg').click(function () {
        $(this).addClass('hidden');
        $('#brand-wrapper').addClass('hidden');
        $('#series-wrapper').addClass('hidden');
    });

    $('#brand-buxian').click(function () {
        setBrands('', '选择品牌')
    })
    $('#series-buxian').click(function () {
        setSeries('', '选择车系');
    })

    $('#select-price-1').change(function () {
        var lowP = $(this).val();
        var $highP = $('#select-price-2');
        var curHighP = $highP.val();
        $highP.empty();
        var findSelected = false;
        var html = '';
        for (var i = 0; i < prices.length; i++) {
            var p = prices[i];
            if (p > lowP) {
                if (p == curHighP) {
                    findSelected = true;
                    html += '<option selected="selected" value="' + p + '">' + p + '万</option>'
                } else {
                    html += '<option value="' + p + '">' + p + '万</option>'
                }
            }
        }
        if (findSelected) {
            html += '<option value="100000000">不限</option>'
        } else {
            html += '<option selected="selected" value="100000000">不限</option>'
        }
        $highP.append(html)
    });
    $('#select-price-2').change(function () {
        var highP = $(this).val();
        var $lowP = $('#select-price-1');
        var curLowP = $lowP.val();
        $lowP.empty();
        var html = '';
        var findSelected = false;
        for (var i = 0; i < prices.length; i++) {
            var p = prices[i];
            if (p < highP) {
                if (p == curLowP) {
                    findSelected = true;
                    html += '<option selected="selected" value="' + p + '">' + p + '万</option>'
                } else {
                    html += '<option value="' + p + '">' + p + '万</option>'
                }
            }
        }
        if (findSelected) {
            html = '<option value="0">不限</option>' + html;
        } else {
            html = '<option selected="selected" value="0">不限</option>' + html;
        }
        $lowP.append(html)
    });

    function hasResult(queryObj) {
        $.ajax({
            url: contextPath + '/pages/mobile/listAction/queryCars.json?index=9999',
            data: queryObj,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (data.page.totalPage == 0) {
                    $('.mobile-popup .cond').text(getAllCond());
                }
            }
        })
    }

    $('#go-list-btn').click(function () {
        var dataObj = {
            carBrand: '',
            carSeries: '',
            carPrice: '',
            carYear: '',
            carMileage: '',
            carModel: '',
            carEngineVolume: '',
            transmissionType: ''
        };

        var year = $('#select-year').val();
        if (year == '') {
            year = '0000-9999'
        } else {
            year = year + '-9999'
        }
        var price1 = $('#select-price-1').val();
        var price2 = $('#select-price-2').val();
        /*
        if ((+price1) > (+price2)) {
            alert('请检查价格范围的选择.')
            return;
        }*/
        dataObj.carYear = year1 + '-' + year2;
        dataObj.carPrice = price1 + '-' + price2;
        dataObj.carBrand = selectedBrand;
        dataObj.carSeries = selectedSeries;
        dataObj.carMileage = $("#select-mile").val();
        dataObj.carModel = $('#select-model').val();
        dataObj.carEngineVolume = $('#select-volume').val();
        dataObj.transmissionType = $('#select-transmission').val();
        //$.ajax for no reuslt
        hasResult(dataObj);
        var addr = contextPath + '/pages/mobile/list.html?';
        for (var i in dataObj) {
            addr += (i + '=' + dataObj[i] + '&');
        }
        //window.location.href = addr;
    })

    function getAllCond() {
        var conds = [];
        var price1 = $('#select-price-1').val();
        var price2 = $('#select-price-2').val();
        if (price1 == '0' && price2 == '100000000') {
            //nothing to do
        } else {
            price2 = (price2 == '100000000' ? '不限' : price2 + '万')
            conds.push(price1 + '万-' + price2);
        }
        if (selectedBrand) {
            conds.push(selectedBrandName)
        }
        if (selectedSeries) {
            conds.push(selectedSeriesName)
        }
        var mile = $('#select-mile').find('option:selected').text();
        if (mile != '不限') {
            conds.push(mile);
        }
        var year1 = $('#select-year-1').val();
        var year2 = $('#select-year-2').val();
        if (year1 == '0000' && year2 == '9999') {
            //noting to do;
        } else {
            year1 = (year1 == '0000' ? '不限' : year1);
            year2 = (year2 == '9999' ? (new Date).getFullYear() : year2);
            conds.push(year1 + '-' + year2);
        }

        var model = $('#select-model').find('option:selected').text();
        if (model != '不限') {
            conds.push(model);
        }
        var volume = $('#select-volume').find('option:selected').text();
        if (volume != '不限') {
            conds.push(volume);
        }
        var transm = $('#select-transmission').find('option:selected').text();
        if (transm != '不限') {
            conds.push(transm);
        }

        if (conds.length) {
            return conds.join('/');
        }

    }
    $('.filter-content select').change(function () {
        $(this).css({
            color: '#000'
        });
    })
}(window.jQuery, undefined)