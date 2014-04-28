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
                color: '#000'
            }).text('选择车系');
            selectedSeries = '';
        }
        selectedBrand = code;
        $('#btn-select-brand').text(name);
        $('#brand-wrapper').addClass('hidden');
        $('#series-list .title').text(name);
        $('.wrapGrayBg').addClass('hidden');
        $('#hot-brands .item').removeClass('selected');
    }

    function setSeries(code, name) {
        selectedSeries = code;
        $('#btn-select-series').text(name).attr('data-brand', selectedBrand);
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
        var code = $self.attr('data-code');
        var name = $self.find('option:selected').text();
        setBrands(code, name);
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

        var year1 = $('#select-year-1').val();
        var year2 = $('#select-year-2').val();
        if (year1 > year2) {
            alert('请检查起止时间的选择.')
            return;
        }
        var thisYear = (new Date()).getFullYear();
        if (year2 == thisYear) {
            year2 = '9999';
        }

        var price1 = $('#select-price-1').val();
        var price2 = $('#select-price-2').val();

        if ((+price1) > (+price2)) {
            alert('请检查价格范围的选择.')
            return;
        }
        dataObj.carYear = year1 + '-' + year2;
        dataObj.carPrice = price1 + '-' + price2;
        dataObj.carBrand = selectedBrand;
        dataObj.carSeries = selectedSeries;
        dataObj.carMileage = $("#select-mile").val();
        dataObj.carModel = $('#select-model').val();
        dataObj.carEngineVolume = $('#select-volume').val();
        dataObj.transmissionType = $('#select-transmission').val();
        //$.ajax for no reuslt
        var addr = contextPath + '/pages/mobile/list.html?';
        for (var i in dataObj) {
            addr += (i + '=' + dataObj[i] + '&');
        }
        window.location.href = addr;
    })
}(window.jQuery, undefined)