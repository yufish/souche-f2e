define(['souche/custom-select'], function (CustomSelect){
  var brandSelect,seriesSelect;
  return {
    init:function(){
      brandSelect = new CustomSelect("brand_select",{
        placeholder:"请选择品牌"
      });
      seriesSelect = new CustomSelect("series_select",{
        placeholder:"请选择车系"
      });
      this._bindBrandChange();
      //没有默认值，则只需要一个请求即可初始化
      brandSelect.removeAllOption();
      seriesSelect.removeAllOption();
      $.ajax({
        url:"/demo/yutou/index/brand.json",//contextPath+"/pages/dicAction/loadRootLevel.json",
        dataType:"json",
        data:{
          type:"car-subdivision"
        },
        success:function(data){
          var html = "";

          for(var i in data.items){
            var item = data.items[i];
            html+=('<a href="#" data-value="'+item.code+'" class="option"><input type="checkbox" class="hidden"/><span class="value">'+item.name+'</span></a>');
          }
          brandSelect.addOptions(html)
        },  
        error:function(){
          alert("品牌信息请求出错，刷新后再试")
        },
        failure:function(){
          alert("品牌信息请求出错，刷新后再试")
        }
      });
    },
    _bindBrandChange:function(){
      var self = this;
      $(brandSelect).on("select",function(e,data){
        console.log(data)
        self._addSeries(data.key)
        //选中了某品牌
      }).on("unselect",function(){
        self._removeSeries(data.key)
        //取消选中某品牌，删除其所拥有的车系列表
      })
    },
    _addSeries:function(brandCode){
      $.ajax({
        url:"/demo/yutou/index/series.json",//contextPath+"/pages/dicAction/loadRootLevelForCar.json",
        dataType:"json",
        data:{
          type:"car-subdivision",
          code:brandCode
        },
        success:function(data){
          var html = "";

          for(var i in data.codes){
            var b = data.codes[i];
            var name = i;
            html+="<div data-name='"+name+"' data-brandId='"+brandCode+"'>"
            for(var n =0;n<b.length;n++){
              var series = b[n]
              html+=('<a href="#" data-value="'+series.code+'" class="option"><input type="checkbox" class="hidden"/><span class="value">'+series.name+'</span></a>');
            }
            html+="</div>"
            
          }
          seriesSelect.addOptions(html)
        },  
        error:function(){
          alert("车系信息请求出错，刷新后再试")
        },
        failure:function(){
          alert("车系信息请求出错，刷新后再试")
        }
      });
    },
    _removeSeries:function(brandCode){

    }
  };
});