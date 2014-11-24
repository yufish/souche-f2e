define(['souche/add-series','souche/custom-select','souche/util/load-info'],function(AddSeries,CustomSelect,LoadInfo){
    return {
        init:function(_config){
            AddSeries.init(_config);

            ageSelect = new CustomSelect("age_select", {
                placeholder: "请选择",
                multi: false
            });

            ageSelectHigh = new CustomSelect("age_select_high", {
                placeholder: "请选择",
                multi: false
            });

            new CustomSelect("price_select_high", {
                placeholder: "请选择",
                multi: false
            });
            new CustomSelect("brand_option", {
                placeholder: "请选择",
                multi: false
            });
            priceSelect = new CustomSelect("price_select", {
                placeholder: "请选择",
                multi: false
            });

            var provinceSelect = new CustomSelect("privince",{
                placeholder: "请选择省",
                multi: false
            })
            $(provinceSelect).on("change",function(e,data){
                $("#privince .selected_values").val(data.value)
            })
            var citySelect = new CustomSelect("city",{
                placeholder: "请选择市",
                multi: false
            })
            $(citySelect).on("change",function(e,data){
                console.log(data)
                $("#privince .selected_values").val(data.value)
            })
            LoadInfo.loadProvince(function(data){
                provinceSelect.removeAllOption()
                for(var i=0;i<data.items.length;i++){
                    provinceSelect.addOptions('<a data-value="'+data.items[i].code+'" class="option"><input type="checkbox" class="hidden"><span class="value">'+data.items[i].name+'</span></a>')
                }
            })
            $(provinceSelect).on("change",function(e,_d){
                LoadInfo.loadCity(_d.key,function(data){
                    citySelect.removeAllOption()
                    for(var i=0;i<data.items.length;i++){
                        citySelect.addOptions('<a data-value="'+data.items[i].code+'" class="option"><input type="checkbox" class="hidden"><span class="value">'+data.items[i].name+'</span></a>')
                    }
                })
            })
//            $(citySelect).on("change",function(e,_d){
//                LoadInfo.loadCity(_d.key,function(data){
//                    areaSelect.removeAllOption()
//                    for(var i=0;i<data.items.length;i++){
//                        areaSelect.addOptions('<a data-value="'+data.items[i].code+'" class="option"><input type="checkbox" class="hidden"><span class="value">'+data.items[i].name+'</span></a>')
//                    }
//                })
//            })
            $(".addCarinstrestItem").click(function(){
                AddSeries.show();
                $(".addInstrestCar").css({
                    left:($(window).width()-$(".addInstrestCar").width())/2,
                    top:100
                })
            })
            $(AddSeries).on("change",function(e,_data){
                var series = [];
                var html = "";
                for(var i=0;i<_data.selectedSeries.length;i++) {
                    var _series = _data.selectedSeries[i].split(",");
                    var _code = _series[0];
                    var _name = _series[1];
                    html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/series/"+_code+".png'/>"+_name+"</div>"

                    series.push(_name);

                }
                $("#car_series").val(series.join(","))
                $(".selected_series_result").html(html)
            })
            
            //成功弹窗
            $(".buyer-popup .apply_close").click(function(){
                $(".buyer-popup").addClass("hidden")
            })

            var phoneReg = /^1[3458][0-9]{9}$/;
            $("#form-submit").on("click",function(e){
                e.preventDefault();
                if(!$("#you-name").val()){
                    alert("请填写姓名");
                    return;
                }
                if(!$("#you-phone").val()){
                    alert("请填写手机");
                    return;
                }
                if(!phoneReg.test($("#you-phone").val())){
                    alert("请填写正确的手机号码");
                    return;
                }
                if(!$("#car_series").val()){
                    alert("请选择车系")
                    return;
                }
                if(!$("#car_series").val()){
                    alert("请选择车系")
                    return;
                }
                if(!($("#price_select_val").val()||$("#price_select_high_val").val())){
                    alert("请选择预算区间")
                    return;
                }
                if(!($("#price_select_val").val()||$("#price_select_high_val").val())){
                    alert("请选择预算区间")
                    return;
                }
                $.ajax({
                    url:$("#main-form").attr("action"),
                    data:$("#main-form").serialize(),
                    success:function(data){
                        $(".buyer-popup").removeClass("hidden");
                        setTimeout(function(){
                          window.location.href="/pages/buyer.html"
                        },5000);
                    }
                })
//                $("#main-form").submit();
            })
        }
    }
});