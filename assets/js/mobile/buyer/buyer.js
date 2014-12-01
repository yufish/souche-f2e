!function(){
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
    var utils = {
        getAllBrand: function (cb) {
            $.ajax({
                url: contextPath + "/pages/dicAction/loadRootLevel.json?type=car-subdivision",
                dataType: "json",
                success: cb
            })
        },
        getSeriesByBrand: function (bCode, cb) {
            $.ajax({
                url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                dataType: "json",
                data: {
                    type: "car-subdivision",
                    code: bCode
                },
                success: cb
            })
        }
    }
    !function buildPrice(minSelect,maxSelect){
        var prices =[5, 8, 12, 16, 20, 25, 30, 50, 70, 100];
        var maxPrice=10000,minPrice=0;

        function makeOption(price,selected){
            selected = selected || false;
            var value = (price==maxPrice||price==minPrice)?'不限':price+'万'
            if(selected) {
                return '<option selected="selected" value="' + price + '">' + value +'</option>'
            }else{
                return '<option value="' + price + '">' + value + '</option>';
            }
        }
        //init options,exported by filterGlobal
        function initPriceOption(){
            maxSelect.empty();
            minSelect.empty();
            var initOption = '';
            prices.forEach(function(item){
                initOption+=makeOption(item);
            })
            minSelect.append(makeOption(minPrice,true)+initOption);
            maxSelect.append(initOption+makeOption(maxPrice,true));
        }
        initPriceOption();

        //两个下拉框的联动
        minSelect.change(function(){
            var maxValue= +maxSelect.val(),
                minValue= +minSelect.val();
            maxSelect.empty();
            var findSelected = false;
            var html = '';
            prices.forEach(function(p){
                if (p > minValue) {
                    if (p == maxValue) {
                        findSelected = true;
                        html += makeOption(p,true)
                    } else {
                        html +=makeOption(p);
                    }
                }
            })
            maxSelect.append(html+makeOption(maxPrice,!findSelected));
        })
        maxSelect.change(function(){
            var maxValue= +maxSelect.val(),
                minValue= +minSelect.val();
            minSelect.empty();
            var findSelected = false;
            var html = '';
            prices.forEach(function(p){
                if(p<maxValue) {
                    if (p == minValue) {
                        findSelected = true;
                        html += makeOption(p,true)
                    } else {
                        html += makeOption(p)
                    }
                }
            })
            minSelect.append(makeOption(minPrice,!findSelected)+html);
        })
    }($('#J_minPrice'),$('#J_maxPrice'))

    //品牌车系相关操作
    !function brandSeries(){
        function makeBrands(brands) {
            var b, otherBrandsStr = '';
            var brandList = $('#brand-list');

            var $otherCtn = brandList.find('#other-brands');
            for (var i = 0; i < brands.length; i++) {
                b = brands[i];
                if (!hotBrands_g[b.code]) {
                    otherBrandsStr += '<div data-code="' + b.code + '" class="item col-1-4"><span class="brand-name">' + b.enName + '</span></div>';
                }
            }
            $otherCtn.append(otherBrandsStr);
        }
        function makeSeries(data){
            var codes = data['codes'];
            var html = '';
            for (var i in codes) {
                //html += '<div class="clearfix" >';
                html += '<div class="series-title">' + i + '</div ><div class="series-name-wrapper">'
                var s = codes[i];
                for (var j in s) {
                    var b = s[j];
                    html += '<div class="series-item" data-code="' + b.code + '"><span class="series-name">' + b.name + '</span></div>';
                }
                html += '</div>';
            }
            $('#series-list .series-content').append(html);
        }
        $('#J_brand').on('click',function(){
            //显示品牌弹出框
            $('.wrapGrayBg').removeClass('hidden');
            $('#brand-list').css({
                top: document.body.scrollTop + 50
            }).removeClass('hidden');

            var self = $(this);
            if(self.attr('hasLoaded'))return;
            //add hot brands first
            var hotBrandsStr = '';
            var $hotCtn = $('#brand-list #hot-brands');
            for (var i in hotBrands_g) {
                hotBrandsStr += '<div data-code = "' + i + '"class = "item col-1-4"><span class="brand-name">' + hotBrands_g[i] + ' </span></div>';
            }
            $hotCtn.append(hotBrandsStr);
            utils.getAllBrand(function(data){
                self.attr('hasLoaded',true);
                makeBrands(data.items);
            })
        })

        $('#J_series').on('click',function(){
            if(curBrandCode =='')return;
            $('.wrapGrayBg').removeClass('hidden');
            $('#series-list').css({
                top: document.body.scrollTop + 50
            }).removeClass('hidden');
        })

        var curBrandCode='';
        $('#brand-list').on('click','.item',function(){
            var self = $(this)
            //清空车系的状态
            $('#series-list .series-content').empty();
            $('#J_series').text('请先选择品牌').addClass('no-active');
            $('#brand-list .item').removeClass('selected')
            if(self.hasClass('selected')){
                self.removeClass('selected');
                $('#J_brand').text('选择品牌');
                curBrandCode='';
                seriesList.clear();
            }else{
                self.find('.item').removeClass('selected');
                self.addClass('selected');
                setTimeout(function(){
                    $('.filter-popup-wrapper').addClass('hidden');
                    $('.wrapGrayBg').addClass('hidden');
                },200);
                var bName = self.find('.brand-name').text()
                var bCode = self.attr('data-code');
                curBrandCode = bCode;
                $('#J_brand').text(bName);
                $('.selected-brand-name').text(bName);
                utils.getSeriesByBrand(bCode,makeSeries);
                $('#J_series').text('选择车系').removeClass('no-active')
            }
        })
        var seriesList = {
            list:[],
            nameList:[],
            $input:$('#car_series'),
            removeSeries:function (sCode,sName){
                var seriesList = this.list;
                for(var i=0;i<seriesList.length; i++){
                    if(seriesList[i]==sCode){
                        seriesList.splice(i,1);
                    }
                }

                var seriesNameList = this.nameList;
                for(var i=0;i<seriesNameList.length; i++){
                    if(seriesNameList[i]==sName){
                        seriesNameList.splice(i,1);
                    }
                }
            },
            push:function(sCode,sName){
                this.list.push(sCode)
                this.nameList.push(sName);
            },
            clear:function(){
                this.list = [];
            },
            length:function(){
                return this.list.length;
            },
            syncValue:function(){
                this.$input.val(this.nameList.join(','))
            }
        };

        $('#series-list').on('click','.series-item',function(){
            var self = $(this);
            if(self.hasClass('selected')){
                self.removeClass('selected');
                var sName = self.find('.series-name').text()
                var code = self.attr('data-code');
                seriesList.removeSeries(code,sName)

            }else{
                self.find('.series-item').removeClass('selected');
                self.addClass('selected');
                var sName = self.find('.series-name').text()
                var sCode = self.attr('data-code');
                seriesList.push(sCode,sName)
                $('#J_series').text(sName);
            }
            var len = seriesList.length();
            if(len==0){
                $('#J_series').text('选择车系');
            }else if(len==1){
                $('#J_series').text(sName);
            }else{
                $('#J_series').text('您选择了'+len+'个车系');
            }
            seriesList.syncValue();
        })

    }();
    $('.wrapGrayBg').on('click',function(){
        $('.filter-popup-wrapper').addClass('hidden');
        $('.wrapGrayBg').addClass('hidden');
    })

    $('#J_series-ok-btn').click(function(){
        $('.filter-popup-wrapper').addClass('hidden');
        $('.wrapGrayBg').addClass('hidden');
    })


}();

!function(){
    function loadProvince(cb){
        var url = contextPath+'/pages/dicAction/loadRootLevel.json?type=area';
        $.ajax({
            url: url,
            dataType:'json',
            success:cb
        })
    }
    function loadCityByProvinceCode(code,cb) {
        var url = contextPath + '/pages/dicAction/loadNextLevel.json?type=area';
        $.ajax({
            url:url,
            dataType:'json',
            data:{
                code:code
            },
            success:cb
        })
    }
    loadProvince(function(e){
        var items = e.items;
        var html='<option value="">不限</option>'
        for(var i = 0;i<items.length;i++){
            var code = items[i].code;
            var name = items[i].enName;
            html+='<option value="'+name+'" data-code='+code+'>'+name+'</option>'
        }
        $('#J_province').html(html);
    })
    $('#J_province').change(function(){
        var code =$('#J_province option:selected').attr("data-code");
        loadCityByProvinceCode(code,function(e){
            var items = e.items
            var html='<option value="">不限</option>'
            for(var i = 0;i<items.length;i++){
                var code = items[i].code;
                var name = items[i].enName;
                html+='<option value="'+name+'">'+name+'</option>'
            }
            $('#J_city').html(html);
        })
    })
}()

function checkRequired($dom,msg){
    if($dom.val().trim()==''){
        alert(msg);
        return false;
    }
    return true;
}
$('#main-form').submit(function(e){
    e.preventDefault();
    if(!checkRequired($('#J_name'),'请输入用户名')){
        return;
    }

    if(!checkRequired($("#car_series"),'请选择至少一个车系')){
        return;
    }
    var phoneNum  =$('#J_phone').val();
    var phoneReg = /^1[3458][0-9]{9}$/;
    if(!phoneReg.test(phoneNum)){
        alert('请输入正确的手机号')
        return;
    }
    var url = $(this).attr('action');
    $.ajax({
        url:url,
        data:$(this).serialize(),
        success:function(e){
            console.log(e);
            $('.buyer-alert').show(0);
            setTimeout(function() {
                $('.buyer-alert').hide(0);
            }, 2000)
        }
    })
})
