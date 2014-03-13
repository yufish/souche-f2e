
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
    $("#see_report").on("click",function(e){
      if(!$.cookie('report_alert')){
        e.preventDefault();
        if(confirm("大搜车坚持进行全面严格质检，\n所以质检报告内容会较多。\n建议您使用电脑访问“大搜车”\nsouche.com网站版\n既流畅，使用体验也会更好！\n是否要用手机继续访问？")){
          $.cookie('report_alert', '1', { expires: 1, path: '/' });
          window.location.href=this.href
        }else{
          return false;
        }
      }
    })
    Action.init();
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