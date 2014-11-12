define(['index/mod/rss-addSeries', 'souche/custom-select', 'souche/util/tool'],
function(AddSeries, CustomSelect, Tool){
    var data = {
        brands:[],
        series:[],
        startYear:null,
        endYear:null,
        minPrice:null,
        maxPrice:null
    }
    var ageSelect,ageSelectHigh;
    var priceSelect,priceSelectHigh;
    var config = {};
    
    var Support = Tool.support;


    var _view = {
        initSelect:function(){
            ageSelect = new CustomSelect("age_select", {
                placeholder: "请选择",
                multi: false
            });
            $(ageSelect).on("change",function(e,_data){
                data.startYear = _data.value;
            })
            ageSelectHigh = new CustomSelect("age_select_high", {
                placeholder: "请选择",
                multi: false
            });
            $(ageSelectHigh).on("change",function(e,_data){
                data.endYear = _data.value;
            })

            priceSelect = new CustomSelect("price_select", {
                placeholder: "请选择",
                multi: false
            });
            $(priceSelect).on("change",function(e,_data){
                if(_data.key==-1){
                    $(".select_dataContainer").addClass("hidden");
                    $(".input_dataContainer").removeClass("hidden")
                    return;
                }
                _data.value = _data.value.replace(/[^0-9]/g,"")
                data.minPrice = _data.value;
                $(".low-price").val(data.minPrice);
            })
            priceSelectHigh = new CustomSelect("price_select_high", {
                placeholder: "请选择",
                multi: false
            });
            $(priceSelectHigh).on("change",function(e,_data){
                if(_data.key==-1){
                    $(".select_dataContainer").addClass("hidden");
                    $(".input_dataContainer").removeClass("hidden")
                    return;
                }
                _data.value = _data.value.replace(/[^0-9]/g,"")
                data.maxPrice = _data.value;
                $(".high-price").val(data.maxPrice);
            })
            setInterval(function() {
                $(".low-price").each(function(i, p) {
                    if(/[^0-9]/.test($(p).val())){

                    $(p).val($(p).val().replace(/[^0-9]/, ""))
                        }
                })
                $(".high-price").each(function(i, p) {
                    if(/[^0-9]/.test($(p).val())) {
                        $(p).val($(p).val().replace(/[^0-9]/, ""))
                    }
                })
            }, 200)
        },
        //根据配置的userRequementJson的生成初始数据
        initData:function(initJson){
            if(initJson.brands&&initJson.brands.length){
                for(var i=0;i<initJson.brands.length;i++){
                    var series = initJson.brands[i].split(",");
                    var _code = series[0];
                    data.brands.push(_code);
                }
            }
            if(initJson.series&&initJson.series.length){
                for(var i=0;i<initJson.series.length;i++){
                    var series = initJson.series[i].split(",");
                    var _code = series[0];
                    data.series.push(_code);
                }
            }
            if(initJson.startYear) {
                data.startYear = initJson.startYear;
                // ageSelect.setSelected(data.startYear);
            }
            if(initJson.endYear) data.endYear = initJson.endYear;
            if(initJson.minPrice) data.startYear = initJson.minPrice;
            if(initJson.maxPrice) data.startYear = initJson.maxPrice;
        },
        bind:function(){
            var self = this;
            //选择感兴趣的车系
            $(".addCarinstrestItem").on("click",function(){
                AddSeries.show();
            });
            //从series读取数据
            $(AddSeries).on("change",function(e,_data){
                data.series = [];
                for(var i=0;i<_data.selectedSeries.length;i++) {
                    var series = _data.selectedSeries[i].split(",");
                    var _code = series[0];
                    data.series.push(_code);
                }
                data.brands = [];
                for(var i=0;i<_data.selectedBrands.length;i++) {
                    var series = _data.selectedBrands[i].split(",");
                    var _code = series[0];
                    data.brands.push(_code);
                }
                self._renderSelected(_data.selectedSeries,_data.selectedBrands);
            })
            //删除的动作，
            $(".selected_series_result").on("click",".selected-item",function(){
                AddSeries.delSeries($(this).attr("code"))
            })

            var rss_isSubmiting = false;
            //提交订阅
            $("#J_xuqiu_submit").on("click",function(){

                if(rss_isSubmiting) return;

                data.minPrice = $(".low-price").val();
                data.maxPrice = $(".high-price").val();
                if(!(data.brands.length
                    ||data.series.length
                    ||data.endYear
                    ||data.startYear
                    ||data.minPrice
                    ||data.maxPrice)){
                    $(".trail .warning").html("请至少填写一项").removeClass("hidden")
                    return;
                }
                if(data.startYear&&data.endYear&&data.minYear>data.maxYear){
                    $(".trail .warning").html("年份选择错误").removeClass("hidden")
                    return;
                }
                if(data.minPrice&&data.maxPrice&&data.minYear>data.maxYear){
                    $(".trail .warning").html("预算填写错误").removeClass("hidden")
                    return;
                }
                rss_isSubmiting = true;
                $(this).addClass("loading").html("提交中")
                Souche.MiniLogin.checkLogin(function(){
                    $.ajax({
                        url:config.submit_api,
                        data:{
                            brands:data.brands.join(","),
                            series:data.series.join(","),
                            minYear:data.startYear,
                            maxYear:data.endYear,
                            minPrice:data.minPrice,
                            maxPrice:data.maxPrice
                        },
                        dataType:"json",
                        success:function(result){
                            window.location.href=(window.location.href.indexOf("fromRss=1")!=-1)?window.location.href:(window.location.href+"?fromRss=1")
                        },
                        error:function(){

                            rss_isSubmiting = false;
                        }
                    })
                },false,false,false)

            })
            //获取一个初始宽度
            if($(".dialogContentContainer").hasClass("hidden")){
                $(".dialogContentContainer").css({opacity:0}).removeClass("hidden")
                var dialogWidth = $(".dialogContentContainer").width();
                $(".dialogContentContainer").css({opacity:1}).addClass("hidden")
            }else{
                var dialogWidth = $(".dialogContentContainer").width();
            }

            
        },
        renderSelected:function(selectedSeries,selectedBrands){
            var html = "";
            for(var i=0;i<selectedSeries.length;i++) {
                var series = selectedSeries[i].split(",");
                var _code = series[0];
                var _name = series[1];
                html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/series/"+_code+".png'/>"+_name+"</div>"
            }
            for(var i=0;i<selectedBrands.length;i++) {
                var series = selectedBrands[i].split(",");
                var _code = series[0];
                var _name = series[1];
                html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/brand/"+_code+".png'/>"+_name+"</div>"
            }
            $(".selected_series_result").html(html);
        }
    };

    var _event = {
        bind: function(){
            //编辑订阅卡片
            $("#J_card_edit").click(_event.startEdit);
            //去掉填写的需求
            $("#J_xuqiu_cancel").click(_event.cacelEdit);
        },
        startEdit: function(){
            // 如果支持transition
            if( Support.tst ){
                $(".dialogContentContainer").addClass('active');
            }
            else{
                $(".dialogContentContainer").css({width:200}).removeClass("hidden").animate({
                    width: 1180,
                    opacity:1
                },500)
            }
        },
        cacelEdit: function(){
            if( Support.tst ){
                $(".dialogContentContainer").removeClass('active');
            }
            else{
                $(".dialogContentContainer").animate({width:200,opacity:0},500,function(){
                    $(".dialogContentContainer").addClass("hidden")
                })
            }
        }
    };


    function init(_config){
        $.extend(config,_config);
        AddSeries.init(_config);
        _view.initData(_config.userRequementJson);
        _view.bind();
        if(_config.userRequementJson.series){
            _view.renderSelected(_config.userRequementJson.series,_config.userRequementJson.brands)
        }
        _view.initSelect();

        _event.bind();
    }
    return {
        init: init
    }
});