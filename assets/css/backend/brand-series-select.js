require(['souche/custom-select'], function (CustomSelect,Select){
   var brandSort = function(data){
    var zimu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var obj = {}
    for(var i in data){
      var brand = data[i]
      var firstword = brand.name.charAt(0).toUpperCase();
      if(!obj[firstword]){
        obj[firstword] = []
      }
      brand.name = brand.name.substr(2,brand.name.length)
      obj[firstword].push(brand);
    }

    return obj;
  }
  var brandSeries = {
    init:function(){
      brandSelect = new CustomSelect("brand_select",{
        placeholder:"请选择品牌，可多选"
      });
      seriesSelect = new CustomSelect("series_select",{
        placeholder:"请选择车系，可多选"
      });
      //没有默认值，则只需要一个请求即可初始化
      brandSelect.removeAllOption();
      seriesSelect.removeAllOption();
      this._bindBrandChange();
      $.ajax({
        url:contextPath+"/pages/dicAction/loadRootLevel.json",
        dataType:"json",
        data:{
          type:"car-subdivision"
        },
        success:function(data){
          var html = "";
          data = brandSort(data.items);
          for(var i in data){
            var b = data[i];
            var name = i;
            html+="<div data-name='"+name+"' class='clearfix'><div class='word-title'>"+name+"</div><div class='word-brands'>"
            for(var n =0;n<b.length;n++){
              var brand = b[n]
              html+=('<a href="#" data-value="'+brand.code+'" class="option"><input type="checkbox" class="hidden"/><span class="value">'+brand.name+'</span></a>');
            }
            html+="</div></div>"
            
          }
          brandSelect.addOptions(html)
        },  
        error:function(){
          // alert("品牌信息请求出错，刷新后再试")
        },
        failure:function(){
          // alert("品牌信息请求出错，刷新后再试")
        }
      });
    },
    _bindBrandChange:function(){
      var self = this;
      $(brandSelect).on("select",function(e,data){
        self._addSeries(data.key)
        //选中了某品牌
      }).on("unselect",function(e,data){
        self._removeSeries(data.key)
        //取消选中某品牌，删除其所拥有的车系列表
      }).on("show",function(){
      })
    },
    _addSeries:function(brandCode){
      if($("#series_select .sc-select-list div[data-brandid="+brandCode+"]").length){
        return;
      }
      $.ajax({
        url:contextPath+"/pages/dicAction/loadRootLevelForCar.json",
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
            html+="<div data-name='"+name+"' data-brandid='"+brandCode+"' class='clearfix'><div class='brand-title'>"+name+"</div>"
            for(var n =0;n<b.length;n++){
              var series = b[n]
              html+=('<a href="#" data-value="'+series.code+'" class="option"><input type="checkbox" class="hidden"/><span class="value">'+series.name+'</span></a>');
            }
            html+="</div>"
            
          }
          seriesSelect.addOptions(html)
        },  
        error:function(){
          // alert("车系信息请求出错，刷新后再试")
        },
        failure:function(){
          // alert("车系信息请求出错，刷新后再试")
        }
      });
    },
    _removeSeries:function(brandCode){
      $("#series_select .sc-select-list div[data-brandid="+brandCode+"]").remove();
    }
  }
  brandSeries.init();
})