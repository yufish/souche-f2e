var Detail=function(){var d={isLoginURL:"",loginURL:""};return{init:function(n){for(var a in n)d[a]=n[a];this._bindStandard(),setTimeout(function(){$.ajax({url:d.reportURL,type:"get",success:function(d){$("#report").html(d)}})},500),Action.init()},_bindStandard:function(){$("#show_stantard").on("click",function(){$("#standard").css({left:"2.5%",top:30}).removeClass("hidden"),$("#standard_layer").css({width:$(window).width(),height:$(document.body).height()}).removeClass("hidden")}),$("#standard_layer").on("click",function(){$("#standard").addClass("hidden"),$("#standard_layer").addClass("hidden")}),$("#hide_standard").on("click",function(){$("#standard").addClass("hidden"),$("#standard_layer").addClass("hidden")})}}}();