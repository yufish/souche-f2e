
var Detail = function(){
  var config = {
     isLoginURL:"",
        loginURL:""
  }
  return{
    init:function(_config){
        
      for(var i in _config){
        config[i]=_config[i]
      }
      this._bindStandard();
      setTimeout(function(){
    	  $.ajax({
        	  url:config.reportURL,
        	  type:"get",
        	  success:function(html){
        		  $("#report").html(html)
        	  }
          }) 
      },500)
      
      Action.init();
    //   $.ajax({
    //     url:config.isLoginURL,
    //     dataType:"json",
    //     success:function(data){
    //       if(data.result=="false"){
    //         if(confirm("需要您先登录后，才能收藏。")){
    //           window.location.href=config.loginURL;
    //         }
    //       }else{
           
    //     }
    //   },
    //   error:function(){
    //   }
    // })
    },
    _bindStandard:function(){
      $("#show_stantard").on("click",function(){
        $("#standard").css({
          left:"2.5%",
          top:30
        }).removeClass("hidden")
        $("#standard_layer").css({
          width:$(window).width(),
          height:$(document.body).height()
        }).removeClass("hidden")
      })
      $("#standard_layer").on("click",function(){
          $("#standard").addClass("hidden")
        $("#standard_layer").addClass("hidden")
      })
      $("#hide_standard").on("click",function(){
        $("#standard").addClass("hidden")
        $("#standard_layer").addClass("hidden")
      })
    }
  }
}();