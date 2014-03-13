var Want = function(){
  var config = {
    isLoginURL:"",
    loginURL:""
  }
  return {
    init:function(_config){
        for(var i in _config){
            config[i]=_config[i]
        }
        Souche.UI.Select.init({
            eles:['carBrand','carSeries'],
            type:"car-subdivision",
            defaultValues:[]
        })
        Souche.UI.Select.init({
            eles:['province','city'],
            type:"area",
            defaultValues:[]
        })
        $(".option").each(function(i,o){
            $("select",o).on("change",function(){
                $(".value",o).html(this.options[this.selectedIndex].innerHTML)
            })
        })
        
        $("#sellcar-form").on("submit",function(e){
            e.preventDefault();
            if (!$('#carBrand').val()) {
                alert("请选择品牌")
                return false;
            }
            if (!$('#carSeries').val()) {
                alert("请选择车系")
                return false;
            }
            // if (!$('#carModel').val()) {
            //     alert("请选择型号")
            //     return false;
            // }
        
            // var mileage=$('#sell_dis').val();
            // if(mileage&&!(/^[0-9]*$/.test(mileage))){
            //     alert("里程请填写整数")
            //     return false;
            //  }
            // if (!$('#province').val()) {
            //     alert("请选择所在省")
            //     return false;
            // }
            // if (!$('#city').val()) {
            //     alert("请选择城市")
            //     return false;
            // }
            // if (!$('#phone').val()) {
            //     alert("请填写手机")
            //     return false;
            // }
            var self = this;
            $.ajax({
                url:config.isLoginURL,
                dataType:"json",
                success:function(data){
                    if(data.result=="false"){
                        if(confirm("请先登录后，才能提交“求购找车”的需求。当我们找到车后，才能主动联系上您。"))
                        window.location.href=config.loginURL;
                    }else{
                        $.ajax({
                            url:self.action,
                            data:$("#sellcar-form").serialize(),
                            dataType:"json",
                            success:function(data){
                                if(data.errorMessage){
                                    alert(data.errorMessage)
                                }else{
                                    alert("提交成功！")
                                    window.location.href="index.html"
                                }
                            }
                        })
                    }
                }
            })
            
        })
    }
  }
}();