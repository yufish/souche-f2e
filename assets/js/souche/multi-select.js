Souche.UI.CustomMultiSelect = function(){
  var select = function(id){
    this.id = id;
    this.ele = typeof(id)!="string"?$(id):$("#"+this.id);
    this.config = {
      isAutoDrop:true,
      maxDisplayItems:10
    }
    this.selected = []
    this._init();
  };
  /**
  * 自定义事件：change 
  */
  select.prototype = {
     _init:function(){
      var self = this;
      this._bindClick();
      this._bindSelect();
      $(".sc-select-list").css({
        height:this.config.maxDisplayItems*30
      })
      if($(".sc-select-list li",this.ele).length>10){
        $(".sc-select-list",this.ele).css("height",300);
      }
      $(document.body).on("click",function(){
        $(".sc-select-list",self.ele).addClass("hidden");
        $(".sc-select-list").css({
              top:25
        });
      });
     },
     addOption:function(key,value){
        var li =$("<li><a href='#' data-value='"+key+"'><input type='checkbox'/><span class='value'>"+value+"</span></a></li>") 
        $(".sc-select-list",this.ele).append(li)
        this._bindSelect($("a",li));
     },
     removeOption:function(key){
        $(".sc-select-list li a",this.ele).each(function(i,a){
          if($(a).attr("data-value")==key){
            a.parentNode.parentNode.removeChild(a.parentNode)
          }
        })
     },
     _bindClick:function(){
      var self = this;
      $(".sc-select-hd",this.ele).click(function(e){
        var list =$(".sc-select-list",self.ele);
        if($(".sc-select-list",self.ele).hasClass("hidden")){
          $(".sc-select-list").addClass("hidden");
          $(".sc-select-list",self.ele).removeClass("hidden").css({
            top:$(".sc-select-hd",self.ele).height()
          });
          if(self.config.isAutoDrop){
            self._autoDrop(list);
          }
          $(".sc-select-list",self.ele).scrollTop(0)
          $(list[0].parentNode).css({
            zIndex:Souche.UI.CustomMultiSelect.zIndex++
          });
        }else{
          $(".sc-select-list").addClass("hidden");
          list.css({
              top:25
          });
        }
        
        e.stopPropagation();
      });

      
      
     },
     _bindSelect:function(_ele){
      var self = this;
      if(!_ele){
        _ele = $(".sc-select-list li a",this.ele)
      }
      _ele.on("click",function(e){
        e.preventDefault();
        var key = $(this).attr("data-value");
        var value = $(".value",this).html();
        var checkbox = $("input[type=checkbox]",this);
        if(checkbox.attr("checked")){
          for(var i =0;i<self.selected.length;i++){
            var s = self.selected[i];
            if(s&&s.key==key){
              self.selected.splice(i,1)
            }
          }
          checkbox.attr("checked",false);
        }else{
          checkbox.attr("checked","checked");
          var alreadySelected = false;
          for(var i =0;i<self.selected.length;i++){
            var s = self.selected[i];
            if(s&&s.key==key){
              alreadySelected = true;
            }
          }
          if(!alreadySelected){
            self.selected.push({key:key,value:value,ele:this})
          }else{

          }
        }
        self._renderSelected();
        $(self).trigger("change",{key:key,value:value,ele:this})
        // $(".sc-select-content",self.ele).html(value)
        // $(".selected_value",self.ele).val(key)
        e.stopPropagation();
      })
 
     },
     _renderSelected:function(){
      var self = this;
      $(".sc-select-content",self.ele).html("")
      for(var i=0;i<self.selected.length;i++){
        var s = self.selected[i];
        $(".sc-select-content",self.ele).append("<div class=sc-selected-item data-value='"+s.key+"'>"+s.value+"<i class=sc-close>x</i></div>")
        
      }
      $(".sc-selected-item",self.ele).on("click",function(e){
        var key = $(this).attr("data-value");
        for(var i =0;i<self.selected.length;i++){
            var s = self.selected[i];
            if(s&&s.key==key){
              self.selected.splice(i,1)
            }
          }
        self._renderSelected();
        $(".sc-select-list li a input[type=checkbox][data-value='"+key+"']").attr("checked",false)
        e.stopPropagation();
      })
      $(".sc-select-hd",self.ele).css({
        height:$(".sc-select-content",self.ele).height()
      })
      $(".sc-select-list",self.ele).css({
        top:$(".sc-select-hd",self.ele).height()
      });

     },
     _autoDrop:function(list){
      var c = this.config
      //自适应滚屏,求实现，如果select被覆盖，自动缩短其高度
      // if(list.offset().top+list.height()>$(window).scrollTop()+$(window).height()){
      //   list.css({
      //     height:c.optionHeight-list.offset().top-list.height()+23
      //   });
        
      // }else{
      //   list.css({
      //     top:25
      //   });
      // }
     }
  };
  return select;
}();
Souche.UI.CustomMultiSelect.zIndex =10000;
