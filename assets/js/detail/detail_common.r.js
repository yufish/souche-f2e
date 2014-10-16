<<<<<<< HEAD
define("detail/mod/fav",[],function(){var e={},t=!1,n=function(){$.ajax({url:e.api_saveFavorite,data:{phone:$("#fav-phone").val(),carType:e.carType,carId:e.carId},dataType:"json",type:"post",success:function(e){if(e.errorMessage)alert(e.errorMessage);else{var n=$("#J_shoucang").offset();$("<div class='icon-fei'></div>").css({left:n.left+7,top:n.top+7}).appendTo(document.body).animate({left:$(".sidebar").offset().left+10,top:$(".sidebar").offset().top+10,opacity:0},700,function(){$(".collectside").addClass("flash"),setTimeout(function(){$(".collectside").removeClass("flash")},500)}),$("#fav-popup").addClass("hidden"),$(".wrapGrayBg").hide(),$("#J_shoucang label").html("已收藏"),$("#J_shoucang").attr("value","1").addClass("faved");var r=$("#J_car_favorite").html();$("#J_car_favorite").html(parseInt(r)+1),t=!1}}})},r=function(){$.ajax({url:e.api_delFavorite,data:{carId:e.carId},dataType:"json",type:"post",success:function(e){$("#J_shoucang label").html("收藏"),$("#J_shoucang").removeClass("faved"),$("#J_shoucang").addClass("fav");var n=$("#J_car_favorite").html();$("#J_car_favorite").html(parseInt(n)-1),t=!1}})};return{init:function(i){e=i,$("#J_shoucang").live("click",function(e){e.preventDefault();if($(this).hasClass("faved")){r();return}if(t)return;Souche.MiniLogin.checkLogin(function(){t=!0,n()})})}}}),define("detail/init_summary",[],function(){var e={},t=function(){return ns="http://www.w3.org/2000/svg",!!document.createElementNS&&!!document.createElementNS(ns,"svg").createSVGRect}(),n;return{load_price:function(){$.ajax({url:n.api_price+n.brandCode+"/s/"+n.seriesCode+(n.modelCode?"/m/"+n.modelCode:"")+"/p/默认",dataType:"jsonp",success:function(e){var t=e.data;if(t){var r=t;n.maxPrice=n.maxPrice*1,n.minPrice=n.minPrice*1,n.taxPrice=(n.taxPrice*1).toFixed(1)*1,n.minPrice==0&&(n.minPrice=n.maxPrice),$(".onsale-tab-item-price").removeClass("hidden"),$(".float-nav-item-price").removeClass("hidden"),$("#onsale_price").removeClass("hidden");var i=(r.price_guide.toFixed(1)*1+n.taxPrice).toFixed(2),s=((n.minPrice+n.maxPrice)/2).toFixed(2)*1,o=n.minPrice+"-"+n.maxPrice;n.minPrice==n.maxPrice&&(o=n.minPrice);if(r.priceNude)var u=((r.priceNude.lowPrice+r.priceNude.highestPrice)/2).toFixed(1);else var u=((s+i)/2).toFixed(2);u=(u*1+n.taxPrice).toFixed(2),require(["detail/draw-sanprice"],function(e){e.draw(s,i,u,o)})}else $("*[data-id=onsale_price]").addClass("hidden")}})},load_baoyang:function(){$.ajax({url:n.api_maintenance+n.brandCode+"/s/"+n.seriesCode+(n.modelCode?"/m/"+n.modelCode:""),dataType:"jsonp",success:function(e){var t=e.data;if(t){var r=t;$(".onsale-tab-item-baoyang").removeClass("hidden"),$(".float-nav-item-baoyang").removeClass("hidden"),$("#onsale_baoyang").removeClass("hidden");var i={},s=0;for(var o=0;o<r.maintenanceItem.length;o++)i[r.maintenanceItem[o].name]=r.maintenanceItem[o].price,s+=r.maintenanceItem[o].price;s<0&&$("*[data-id=onsale_baoyang]").addClass("hidden");var u=[];for(var o in r.mileageMark){var a=r.mileageMark[o],f=a.name.replace(/ 公里.*$/,"")*1,l=0;for(var c=0;c<a.MaintenanceItemNames.length;c++){var h=a.MaintenanceItemNames[c];l+=i[h]*1}u.push({distance:f,items:a.MaintenanceItemNames,price:l})}u.sort(function(e,t){return e.distance-t.distance}),require(["detail/draw-baoyang"],function(e){e.draw({distanceData:u,nowDistance:n.nowDistance})})}else $("*[data-id=onsale_baoyang]").addClass("hidden")}})},load_koubei:function(){$.ajax({url:n.api_sentiment+n.brandCode+"/s/"+n.seriesCode,dataType:"jsonp",success:function(e){if(e&&e.data&&e.data.items&&e.data.items.length){var t=[],r={upholstery:"内饰",accelerate:"加速",manipulate:"操控",space:"空间",detail:"细节",appearance:"外观",configuration:"配置",comfortable:"舒适",noise:"噪音"},i=e.data.items[0];if(e.data){var t=[];for(var s in r)if(i[s]){for(var o=0;o<i[s].comments.length;o++){var u=i[s].comments[o];u=u.replace(/\((.*?)\)/,function(e,t){return"("+(t*1).toFixed(0)+")"}),i[s].comments[o]=u}t.push({name:r[s],rate:(i[s].score*1).toFixed(2),labels:i[s].comments.slice(0,3)})}else t.push({name:r[s],rate:1,labels:[]})}require(["detail/draw-koubei"],function(e){e.draw({items:t,allScore:i.generalScore,seriesName:i.seriesName,seriesCode:i.seriesCode,relatedSeries:i.relatedSeries,topPosReview:i.topPosReview,topNegReview:i.topNegReview},n),$(".onsale-tab-item-koubei").removeClass("hidden"),$(".float-nav-item-koubei").removeClass("hidden"),$("#onsale_koubei").removeClass("hidden")})}else $("*[data-id=onsale_koubei]").addClass("hidden")}})},init_brandHistory:function(){$("#onsale_brand img").lazyload(),$(".age-image img").click(function(){$(this).closest(".age-image").children("img").each(function(){$(this).toggleClass("one-image")})})},init:function(e){n=e;var r=this,i=$(".onsale-tab-item").offset().top;$(".onsale-tab-item").on("click",function(e){var t=$(this).attr("data-id");$(".onsale-content-item").addClass("hidden"),$("#"+t).removeClass("hidden"),$(window).trigger("nav_change",t),$(this).attr("data-scrollto")&&$("html,body").animate({scrollTop:$("#"+$(this).attr("data-scrollto")).offset().top-20},500,function(){$(".onsale-tab-item").removeClass("active"),$(n).addClass("active")});var n=this}),$(".onsale-tab-bigitem .bigitem-inner").on("click",function(e){var t=$(this).attr("data-id");$(".onsale-content-item").addClass("hidden"),$("#"+t).removeClass("hidden"),$(window).trigger("nav_change",t),$(this).attr("data-scrollto")&&$("html,body").animate({scrollTop:$("#"+$(this).attr("data-scrollto")).offset().top-20},500,function(){$(".onsale-tab-bigitem").removeClass("active"),$(n.parentNode).addClass("active")});var n=this}),$(".onsale-tab-item:not(hidden)").each(function(e,t){$("#"+$(t).attr("data-scrollto")).length&&Souche.Util.appear("#"+$(t).attr("data-scrollto"),function(){$(".onsale-tab-item").removeClass("active"),$(t).addClass("active")},$(window).height()-100,!0)}),$(".float-nav-item").on("click",function(e){var t=$(this).attr("data-id");$(".onsale-content-item").addClass("hidden"),$("#"+t).removeClass("hidden"),$(".float-nav-item").removeClass("activeNav"),$(this).addClass("activeNav"),$(window).trigger("nav_change",t),e.preventDefault()});var s=!1,o=!1;$(window).on("nav_change",function(e,t){t=="onsale_pics"?s||($("#onsale_pics img").lazyload(),s=!0):t=="onsale_brand"?o||(r.init_brandHistory(),o=!0):t=="onsale_koubei"}),t&&n.showChart&&(r.load_price(),r.load_baoyang(),r.load_koubei())}}}),function(){function k(e){var t=null,n=$("#user-regPhone").val();if(!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(n)||n.length!=11){h.html("请正确填写手机号码"),t!=null&&clearInterval(t),e.attr("disabled",!1),e.val("获取验证码");return}var r=0;e.attr("disabled",!0),setTimeout(function(){e.attr("disabled",!1),t!=null&&clearInterval(t),e.val("获取验证码")},6e4),t=setInterval(function(){r<60&&(e.val(60-r+"秒后可重发"),r++)},1e3);var i=$("#user-test").val();Bimu.ajax.post("sendMessageAction","sendMessage",{phoneNumber:n,type:"register",uuid:i},function(n){n.id?(h.html("该手机号码已经注册"),t!=null&&clearInterval(t),e.val("获取验证码"),e.attr("disabled",!1)):h.html("")},function(){})}function L(){return Math.floor((1+Math.random())*65536).toString(16).substring(1)}function A(){return L()+L()+"-"+L()+"-"+L()+"-"+L()+"-"+L()+L()+L()}$(".apply_close, .popup-sure").live("click",function(){$(".apply_popup").addClass("hidden"),$(".wrapGrayBg").hide()}),$("#link-to-fenqi").click(function(){return $("#fenqi-popup").removeClass("hidden"),$(".wrapGrayBg").show(),!1}),$("#detailDoor .tab-item").mouseenter(function(){var e=$(this),t=e.index(),n=null,r=$(".tab-content-active");$(".tab-item-active").removeClass("tab-item-active"),e.addClass("tab-item-active");switch(t){case 0:n=$("#J_tabService");break;case 1:n=$("#J_tabCqi");break;default:n=$("#J_tabAddr")}n.attr("class").indexOf("tab-content-active")==-1&&(n.addClass("tab-content-active"),r.removeClass("tab-content-active"))}),$("#detailDoor .tab-item").mouseenter(function(){var e=$(this),t=e.index(),n=null,r=$(".tab-content-active");$(".tab-item-active").removeClass("tab-item-active"),e.addClass("tab-item-active");switch(t){case 0:n=$("#J_tabService");break;case 1:n=$("#J_tabCqi");break;default:n=$("#J_tabAddr")}n.attr("class").indexOf("tab-content-active")==-1&&(n.addClass("tab-content-active"),r.removeClass("tab-content-active"))});var e=/^1[3458][0-9]{9}$/,t=$("#arrow-time"),n=$("#arrow-mortgage"),r=$("#arrow-rate"),i=$("#arrow-rate").attr("interest"),s=$("#fenqi_list"),o=$("#fenqi_list li"),u=$("#fenqi-wrap");$fenqiMort=$("#fenqi-mort");var a=function(e){var r,s,o="fenqi-arrow arrow";if(i=="1")switch(e){case"6":r="0",s="3";break;case"12":r="1",s="2";break;case"24":r="2",s="1";break;case"36":r="3",s="4"}else switch(e){case"12":r="1",s="3";break;case"24":r="2",s="2";break;case"36":r="3",s="1"}t.attr("class",o+r),n.attr("class",o+s)};$("#fenqi_select").click(function(e){s.show(),e.stopPropagation()}),$("body, html").click(function(){s.hide()}),o.click(function(){var e=$(this),t=e.attr("time"),n=e.attr("mortpay"),i=e.attr("rate"),s=e.text();u.text(s),r.text(i),$fenqiMort.text(n),a(t)});var f=$("#dialog-getMes"),l=$("#dialog-showMes, #dialog-apply2"),c=$("#dialog-login").find(".dialog-user-remind"),h=$("#dialog-reg").find(".dialog-user-remind"),p=$("#dialog-showPrice"),d=$("#dialog-showText"),v=$("#dialog-priceVal"),m=$("#dialog-apply1").attr("price"),g=$("#dialog-textVal"),y=function(){p.text(v.val()),d.text(g.val()),l.removeClass("hidden")},b=$("#dialog-mes-num");$("#dialog-textVal").keyup(function(){var e=$(this).val().length;b.text(e),e>=250});var w=function(){$.ajax({url:SaleDetailConfig.api_sendCarToPhone,data:{carId:SaleDetailConfig.carId,phone:$("#send-phone").val()},type:"post",success:function(e){$("#send-phone-submit").addClass("hidden"),$(".send-success").removeClass("hidden"),window.setTimeout(function(){$(".wx-open").addClass("hidden")},2e3)}})};$(".detail-share #J_wx_phone").click(function(e){e.stopPropagation(),$(".wx-open").removeClass("hidden")}),$(document.body).click(function(){$(".wx-open").addClass("hidden")}),$("#send-phone-form").on("submit",function(t){t.preventDefault();if(!e.test($("#send-phone").val())){$(".warning",this).removeClass("hidden");return}$(".warning",this).addClass("hidden"),w()});var E=function(){$.ajax({url:$("#ph-form")[0].action,data:{carId:SaleDetailConfig.carId},type:"post",success:function(e){$("body").append(e),$(".wrapGrayBg").show(),$("#ph-popup").addClass("hidden"),$("#ph-result-popup").removeClass("hidden")}})};$(".detail-share .ph").click(function(){$("#ph-popup .popup-title").html("保存到手机"),$("#ph-popup .apply_close").attr("click_type",SaleDetailConfig.sendCarClose),$("#ph-popup .ph-submit").attr("click_type",SaleDetailConfig.sendCarSubmit),$("#ph-popup .tip").html("车辆内容会以短信方式保存到您的手机"),$("#ph-form")[0].action=SaleDetailConfig.api_sendCarToPhone,Souche.checkPhoneExist(function(e){e?E():($("#ph-popup").removeClass("hidden"),$(".wrapGrayBg").show())})}),$("#ph-form").on("submit",function(t){t.preventDefault(),e.test($("#ph-phone").val())?Souche.PhoneRegister($("#ph-phone").val(),function(){E()}):$(".warning",this).removeClass("hidden")}),$("#ph-phone").blur(function(t){t.preventDefault(),e.test($("#ph-phone").val())?($(".warning",$("#ph-form")).addClass("hidden"),$(".phone-true").removeClass("hidden")):$(".warning",$("#ph-form")).removeClass("hidden")}),$(".car-adress .send-adress").mousemove(function(){$(".adress-open").removeClass("hidden")}),$(document.body).on("click",function(e){$(e.target).closest(".adress-open").length||$(".adress-open").addClass("hidden")});var S=function(){$.ajax({url:SaleDetailConfig.api_AddressToPhone,data:{phone:$("#address-phone").val()},type:"post",success:function(){$(".adress-open").addClass("hidden")}})};$("#adress-from").on("submit",function(t){t.preventDefault(),e.test($("#address-phone").val())?S():alert("请输入正确手机号码")});var x=function(){$.ajax({url:$("#jiangjia-form").attr("action"),data:$("#jiangjia-form").serialize(),success:function(e){e.errorMessage?alert(e.errorMessage):($("#jiangjia-popup").addClass("hidden"),$("#jiangjia-success-popup").removeClass("hidden"),$(".wrapGrayBg").show())}})};$(".detail-share .rep").click(function(e){$(this).closest(".report").addClass("report-active"),$(".report-open").removeClass("hidden"),e.stopPropagation()}),$(document.body).on("click",function(e){$(e.target).closest(".report-open").length||($(".report-open").addClass("hidden"),$(".report").removeClass("report-active"))});var T=function(){$.ajax({url:"http://niu.souche.com/open/inform_car",data:{carId:SaleDetailConfig.carId,reason:$(".report-input:checked").val(),userId:"#"},dataType:"json",type:"post",success:function(){$(".report-open").addClass("hidden"),$(".rep").addClass("hidden"),$(".has-rep").removeClass("hidden")}})};$(".report-form").on("submit",function(e){e.preventDefault(),T(),$(".report-open").addClass("hidden"),$(".rep").addClass("hidden"),$(".has-rep").removeClass("hidden"),$(".share-item").removeClass("report-active")}),$("#jiangjia-form").submit(function(t){t.preventDefault();if(!e.test($("#jiangjia-phone").val())){$(".warning",this).removeClass("hidden");return}Souche.PhoneRegister($("#jiangjia-phone").val(),function(){x()})}),$("#J_jiangjia").on("click",function(){$("#jiangjia-popup").removeClass("hidden"),$(".wrapGrayBg").show()}),Bimu.form.selfValidate("J_dialogForm","dialog-sendMes",function(){if(!/^\+?[1-9][0-9]*$/.test(v.val()))return $("#price-valid").show(),!1;if(parseInt(v.val())>=parseInt(m))return $("#price-illegal").show(),!1;var e=$("#dialog-textVal").val();if(e&&e.length>250)return $("#content-valid").show(),!1;$("#content-valid").hide(),$("#price-illegal").hide(),$("#price-valid").hide(),$.ajax({url:contextPath+"/pages/evaluateAction/isLogin.json",type:"post",dataType:"json",async:!1,success:function(e){return e.result=="true"?(Bimu.ajax.formPost("J_dialogForm",function(){y(),l.removeClass("hidden"),f.removeClass("dialog-error").addClass("hidden"),$(".zixun-main").scrollTop($(".zixun-main").height())}),!0):(f.addClass("dialog-error"),$(".zixun-main").scrollTop($(".zixun-main").height()),!1)},error:function(){return f.addClass("dialog-error"),$(".zixun-main").scrollTop($(".zixun-main").height()),!1}})});var N=!1;$("#shoucang-popup .apply_close").click(function(){$(this).parent().addClass("hidden"),$(".wrapGrayBg").hide()}),Bimu.form.selfValidate("dialog-login","dialog-loginBtn",function(){return $("#user-phone").val()?$("#user-psd").val()?($("#dialog-loginBtn").val("登陆中..."),!0):(c.html("请输入密码"),!1):(c.html("请输入手机号"),!1)},function(e){e.errorMessage==""?Bimu.ajax.formPost("J_dialogForm",function(){y(),l.removeClass("hidden"),f.removeClass("dialog-error").addClass("hidden")}):c.html(e.errorMessage),$(".zixun-main").scrollTop($(".zixun-main").height())}),$("#user-phone").blur(function(){var e=$(this).val();!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(e)||e.length!=11?c.html("请正确填写手机号码！"):c.html("")});var C=A();$("#uuid").val(C),Bimu.form.validate("dialog-reg","dialog-regBtn",function(e){if(e.id){e.msg&&h.html(e.msg);return}h.html(""),$("#user-phone").val($("#user-regPhone").val()),$("#user-psd").val($("#user-regPsd").val()),Bimu.ajax.loginForm("dialog-login",function(e){e.errorMessage==""&&Bimu.ajax.formPost("J_dialogForm",function(){y(),l.removeClass("hidden"),f.removeClass("dialog-error dialog-register").addClass("hidden")})},null)},function(){},{noclear:!0}),$("#user-regPhone").blur(function(){var e=$(this).val();!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(e)||e.length!=11?h.html("请正确填写手机号码"):h.html("")}),$(".dialog-get-yz").click(function(){k($(this))}),$("#J_zixunPrice").click(function(){$("#dialog-apply1,#dialog-getMes").removeClass("hidden").slideDown(200),l.addClass("hidden"),$("#dialog-priceVal").val(""),$("#dialog-textVal").val(""),$(".zixun-main").scrollTop($(".zixun-main").height())}),$(".J_linkShangqiao").mouseenter(function(){$(".shangqiao-remind",this.parentNode).show()}).mouseleave(function(){$(".shangqiao-remind",this.parentNode).hide()}),$("#link-reg").click(function(){return $("#dialog-getMes").addClass("dialog-register"),!1}),$("#link-login").click(function(){return $("#dialog-getMes").removeClass("dialog-register"),!1})}(),$(".advisor-close").click(function(){$(".advisor-unfold").addClass("hidden")}),$(".advisor-unfold").click(function(){$(".advisor-unfold").animate({width:"820px",height:"400px",bottom:"10px"},800)});var phoneReg=/^1[3458][0-9]{9}$/;$(".unfold").on("submit",function(e){e.preventDefault();if(!phoneReg.test($("#unfold-phone").val())){$(".input-error-tip").removeClass("hidden");return}Souche.PhoneRegister($("#unfold-phone").val(),function(){window.location.href=contextPath+"/pages/onsale/match_car_list.html"})}),function(){var e=null,t=null,n=0,r=function(n){e?(t.Slider.setCurrent(n),e.css("display","block")):(e=$("<iframe name='bigImages' id='bigImages' allowtransparency='true' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>"),e.attr("src",SaleDetailConfig.api_bigImg),e.css({display:"none",position:"fixed",top:0,left:0,background:"#000",width:"100%",height:$(document.body).height(),zIndex:1e12}),$(document.body).append(e),t=window.frames.bigImages,$(t).load(function(){t.Slider.init({viewHeight:$(window).height()}),t.Slider.setCurrent(n),e.css("display","block")}))};$("#onsale_detail .photosWrap").click(function(e){var t=e.target;t.nodeName=="IMG"&&(n=$(t).parent().index(),r(n))}),$("#onsale_detail .showBig").click(function(){r(0)})}(),Souche.Detail=Souche.Detail||{},Souche.Detail.PriceDown=function(){var e,t,n,r,i;return{init:function(s){e=parseInt($(".price-now.now").text()),t=e-1e3,n=t.toString(),r='<div class="price-num"><em>',i="</em></div>";for(var o=0;o<n.length;o++)$(".cutprice").append(r+n.charAt(o)+i);$("#expectedPrice").val((t/1e4).toFixed(2)),$("#jiangyidian").click(this.downPriceStep)},downPriceStep:function(){if(100*(e-t)/e>5){$("#jiangyidian").css({"background-position":"0 0",cursor:"auto"}),$(".price-toolow").removeClass("hidden");return}var n=t.toString().length,r=0,i=t-1e3,s=t.toString(),o=i.toString(),u=$(".cutprice");u.find(".price-num em").fadeOut(function(){r++,r==n&&u.find(".price-num.hidden").removeClass("hidden"),$(this.parentNode).remove()});var a='<div class="price-num hidden"><em>',f="</em></div>";for(var l=0;l<o.length;l++)u.append(a+o.charAt(l)+f);t-=1e3,$("#expectedPrice").val((t/1e4).toFixed(2))}}}(),define("detail/detail_common",["detail/mod/fav","detail/init_summary"],function(e,t){return Souche.DetailCommon=function(){var n={},r=function(e){var t=e.srcElement|e.target;t;var r=n.carId;if(r==undefined)return;var i=$(".addcarduibi input").attr("contrastid");return e.target.tagName=="INPUT"&&($(".addcarduibi input")[0].checked=!$(".addcarduibi input")[0].checked),Souche.MiniLogin.checkLogin(function(){if(!$(".addcarduibi input")[0].checked){var t=this;t.e=e,$.ajax({type:"POST",url:n.api_addContrast,dataType:"json",context:t}).done(function(e){if(e.result==2){$(".addcarduibi input").attr("checked","true");var t=$(".addcarduibi").clone();t.css({opacity:.8,position:"absolute",top:this.e.pageY+"px",left:this.e.pageX+"px",backgroundColor:"#ff5517",color:"#fff"});var n=$(".side-box .contrast-img").offset().left,r=$(".side-box .contrast-img").offset().top;document.body.appendChild(t[0]),t.animate({top:r,left:n},500,function(){t.remove()}),$(".addcarduibi input").attr("contrastid",e.contrastId);return}if(e.result==-1){$(".addcarduibi input").attr("checked","true"),$(this).find(".contrast-waring").html("对比已添加！你不需要继续添加。").removeClass("hidden");var i=$(this);window.setTimeout(function(){i.find(".contrast-waring").addClass("hidden")},2e3);return}if(e.result==1){$(this).find(".contrast-waring").html("对比栏已满！你可以删除不需要的车辆，再继续添加。").removeClass("hidden");var i=$(this);window.setTimeout(function(){i.find(".contrast-waring").addClass("hidden")},2e3);return}$(this).find(".contrast-waring").html("加入对比失败，请刷新页面。").removeClass("hidden");var i=$(this);window.setTimeout(function(){i.find(".contrast-waring").addClass("hidden")},2e3)})}else{if(!i)return;$.ajax({type:"POST",url:n.api_deleteContrast,data:{cid:$(".addcarduibi input").attr("contrastid")}}).done(function(e){$(".addcarduibi input").removeAttr("checked"),$(".addcarduibi input").removeAttr("contrastid")})}}),!1},i=function(){$(".addcarduibi,.addcarduibi input").on("click",r)};return{init:function(r){$.extend(n,r),t.init(n),e.init(n),Souche.Detail.PriceDown.init(n),$(".brand-nav").length&&$(window).scroll(function(){var e=$(".brand-nav").offset().top,t=$(".brand-wrapper").height(),n=$(".brand-nav").height();$(window).scrollTop()>e+40?$(window).scrollTop()>e+t-n-150?$(".brand-list").css({position:"absolute",top:t-n-100}):$(".brand-list").css({position:"fixed",top:80}):$(".brand-list").css({position:"relative",top:0})}),i();var s=$("#onsale_tab").offset().top,o=$("#onsale_tab").height();$(window).scroll(function(){var e=$(window).scrollTop();e>s?($("#onsale_tab").css({position:"fixed",top:0,zIndex:1e3}),$("#onsale_tab_space").removeClass("hidden")):($("#onsale_tab").css({position:"relative"}),$("#onsale_tab_space").addClass("hidden"));var t=$(".onsale-summary").height();e>s+t-40&&($("#onsale_tab").css({position:"relative"}),$("#onsale_tab_space").addClass("hidden"))})}}}(),Souche.DetailCommon});
=======
define('detail/mod/fav',[],function() {
    var config = {};
    var doubleClickFlag = false;
    var submitFav = function() {

        $.ajax({
            url: config.api_saveFavorite,
            data: {
                phone: $("#fav-phone").val(),
                carType: config.carType,
                carId: config.carId
            },
            dataType: "json",
            type: "post",
            success: function(data) {
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {
                    //$('#shoucang-popup').removeClass('hidden');
                    var favPos = $("#J_shoucang").offset();
                    $("<div class='icon-fei'></div>").css({
                        left: favPos.left + 7,
                        top: favPos.top + 7
                    })
                        .appendTo(document.body)
                        .animate({
                            left: $(".sidebar").offset().left + 10,
                            top: $(".sidebar").offset().top + 10,
                            opacity: 0
                        }, 700, function() {
                            $(".collectside").addClass("flash")
                            setTimeout(function() {
                                $(".collectside").removeClass("flash")
                            }, 500)
                        })
                    $("#fav-popup").addClass("hidden")
                    $(".wrapGrayBg").hide();
                    $("#J_shoucang label").html('已收藏')
                    $("#J_shoucang").attr('value', '1').addClass("faved");
                    var num = $('#J_car_favorite').html();
                    $('#J_car_favorite').html(parseInt(num) + 1);
                    doubleClickFlag = false;
                }
            }
        })
    }
    var cancelFavSubmit = function() {
        $.ajax({
            url: config.api_delFavorite,
            data: {
                carId: config.carId //$(self).attr("data-carid")
            },
            dataType: "json",
            type: "post",
            success: function(data) {
                $("#J_shoucang label").html('收藏');
                $("#J_shoucang").removeClass("faved");
                $("#J_shoucang").addClass("fav");
                var num = $('#J_car_favorite').html();
                $('#J_car_favorite').html(parseInt(num) - 1);
                doubleClickFlag = false;
            }
        })
    }
    return {
        init: function(_config) {
            config = _config;

            $("#J_shoucang").live('click', function(e) {

                e.preventDefault();

                if ($(this).hasClass("faved")) {

                    cancelFavSubmit()
                    return;
                } else {
                    if (doubleClickFlag) {
                        return;
                    }
                    // Souche.checkPhoneExist(function(is_login) {
                    //     if (is_login) {

                    //         submitFav();
                    //     } else {
                    //         $("#fav-popup").removeClass("hidden")
                    //         $(".wrapGrayBg").show();
                    //     }
                    // })
                    Souche.MiniLogin.checkLogin(function() {
                        doubleClickFlag = true;
                        submitFav();
                    })
                }


            });
        }
    }
});
define('detail/init_summary',[],function() {
    var hasInitTab = {

    }

    var SVGsupported = function() {
        ns = "http://www.w3.org/2000/svg"
        return !!document.createElementNS && !! document.createElementNS(ns, "svg").createSVGRect
    }()
    var config;
    return {
        load_price: function() {
            $.ajax({
                url: config.api_price + config.brandCode + "/s/" + config.seriesCode + (config.modelCode ? "/m/" + config.modelCode : "") + "/p/默认",
                dataType: "jsonp",
                success: function(_data) {
                    var data = _data.data;
                    if (data) {
                        var priceData = data;
                        config.maxPrice = config.maxPrice * 1;
                        config.minPrice = config.minPrice * 1;
                        config.taxPrice = (config.taxPrice*1).toFixed(1)*1;
                        if (config.minPrice == 0) {
                            config.minPrice = config.maxPrice;
                        }
                        $(".onsale-tab-item-price").removeClass("hidden")
                        $(".float-nav-item-price").removeClass("hidden")
                        $("#onsale_price").removeClass("hidden")
                        var maxPrice = ((priceData.price_guide).toFixed(1) * 1+config.taxPrice).toFixed(2);
                        var minPrice = ((config.minPrice + config.maxPrice) / 2).toFixed(2) * 1;
                        var rangePrice = config.minPrice + "-" + config.maxPrice;
                        if (config.minPrice == config.maxPrice) {
                            rangePrice = config.minPrice;
                        }
                        if (priceData.priceNude) {
                            var middlePrice = ((priceData.priceNude.lowPrice + priceData.priceNude.highestPrice) / 2).toFixed(1)
                        } else {
                            var middlePrice = ((minPrice + maxPrice) / 2).toFixed(2);

                        }
                        middlePrice=(middlePrice*1+config.taxPrice).toFixed(2)

                        require(['detail/draw-sanprice'], function(SanPrice) {
                            SanPrice.draw(minPrice, maxPrice, middlePrice, rangePrice);
                        })
                    } else {
                        $("*[data-id=onsale_price]").addClass("hidden")
                    }
                }
            })
            // require(['detail/draw-price-down'], function(DrawPriceDown) {
            //     DrawPriceDown.draw([250, 230, 200, 150, 100, 60])
            // })
        },
        load_baoyang: function() {
            $.ajax({
                url: config.api_maintenance + config.brandCode + "/s/" + config.seriesCode + (config.modelCode ? "/m/" + config.modelCode : ""),
                dataType: "jsonp",
                success: function(_data) {
                    var data = _data.data;
                    if (data) {
                        var baoyangData = data;
                        $(".onsale-tab-item-baoyang").removeClass("hidden");
                        $(".float-nav-item-baoyang").removeClass("hidden");
                        $("#onsale_baoyang").removeClass("hidden")
                        var prices = {};
                        var totalPrice = 0;
                        for (var i = 0; i < baoyangData.maintenanceItem.length; i++) {
                            prices[baoyangData.maintenanceItem[i].name] = baoyangData.maintenanceItem[i].price;
                            totalPrice+=baoyangData.maintenanceItem[i].price;
                        }
                        if(totalPrice<0){
                            $("*[data-id=onsale_baoyang]").addClass("hidden")
                        }
                        var distanceData = [];
                        for (var i in baoyangData.mileageMark) {
                            var mileData = baoyangData.mileageMark[i];
                            var distance = mileData.name.replace(/ 公里.*$/, "") * 1;
                            var _prices = 0;
                            for (var n = 0; n < mileData.MaintenanceItemNames.length; n++) {
                                var key = mileData.MaintenanceItemNames[n];
                                _prices += prices[key] * 1;
                            }
                            distanceData.push({
                                distance: distance,
                                items: mileData.MaintenanceItemNames,
                                price: _prices
                            })
                        }
                        distanceData.sort(function(i1, i2) {
                            return i1.distance - i2.distance;
                        })
                        require(['detail/draw-baoyang'], function(Baoyang) {
                            Baoyang.draw({
                                distanceData: distanceData,
                                nowDistance: config.nowDistance
                            })
                        })
                    } else {
                        $("*[data-id=onsale_baoyang]").addClass("hidden")
                    }
                }
            })
        },
        load_koubei: function() {
            $.ajax({
                url: config.api_sentiment + config.brandCode + "/s/" + config.seriesCode, //"http://115.29.10.121:8282/soucheproduct/car/sentiment/b/" + config.brandCode + "/s/" + config.seriesCode,
                dataType: "jsonp",
                success: function(_data) {
                    if (_data && _data.data&&_data.data.items&&_data.data.items.length) {
                        var koubeiData = [];
                        var kv = {
                            upholstery: "内饰",
                            accelerate: '加速',
                            manipulate: '操控',
                            space: '空间',
                            detail: '细节',
                            appearance: '外观',
                            configuration: '配置',
                            comfortable: "舒适",
                            noise: "噪音"
                        }
                        var data = _data.data.items[0]
                        if (_data.data) {
                            var koubeiData = [];
                            for (var i in kv) {
                                if (data[i]) {
                                    for (var c = 0; c < data[i].comments.length; c++) {
                                        var label = data[i].comments[c];
                                        label = label.replace(/\((.*?)\)/, function(v, v2) {
                                            return "(" + ((v2 * 1)).toFixed(0) + ")"
                                        })
                                        data[i].comments[c] = label
                                    }
                                    koubeiData.push({
                                        name: kv[i],
                                        rate: (data[i].score * 1).toFixed(2),
                                        labels: data[i].comments.slice(0, 3)
                                    })
                                } else {
                                    koubeiData.push({
                                        name: kv[i],
                                        rate: 1,
                                        labels: []
                                    })
                                }
                            }
                        }
                        require(['detail/draw-koubei'],
                            function(DrawKoubei) {
                                DrawKoubei.draw({
                                    items: koubeiData,
                                    allScore: data.generalScore,
                                    "seriesName": data.seriesName,
                                    "seriesCode": data.seriesCode,
                                    "relatedSeries": data.relatedSeries,
                                    "topPosReview": data.topPosReview,
                                    "topNegReview": data.topNegReview
                                },config)
                                $(".onsale-tab-item-koubei").removeClass("hidden");
                                $(".float-nav-item-koubei").removeClass("hidden")
                                $("#onsale_koubei").removeClass("hidden")
                            }
                        )

                    } else {
                        $("*[data-id=onsale_koubei]").addClass("hidden")
                    }

                }
            })
        },
        init_brandHistory: function() {
            $("#onsale_brand img").lazyload();
            $(".age-image img").click(function() {
                $(this).closest(".age-image").children("img").each(function() {
                    $(this).toggleClass("one-image");
                })
                // $(this).addClass("one-image");
                // $(this).removeClass("more-image");
            })


        },
        init: function(_config) {
            config = _config;
            var self = this;
            var saleTabTop = $(".onsale-tab-item").offset().top;

            $(".onsale-tab-item").on("click", function(e) {
                var id = $(this).attr("data-id");
                $(".onsale-content-item").addClass("hidden")
                $("#" + id).removeClass("hidden");
                // $(".onsale-tab-item").removeClass("active");
                // $(this).addClass("active")
                $(window).trigger("nav_change", id);

                if ($(this).attr("data-scrollto")) {
                    $('html,body').animate({
                        scrollTop: $("#" + $(this).attr("data-scrollto")).offset().top - 20
                    }, 500, function() {
                        $(".onsale-tab-item").removeClass("active");
                        $(self).addClass("active")
                    });
                }
                var self = this;

            });
            $(".onsale-tab-bigitem .bigitem-inner").on("click", function(e) {
                var id = $(this).attr("data-id");
                $(".onsale-content-item").addClass("hidden")
                $("#" + id).removeClass("hidden");
                // $(".onsale-tab-item").removeClass("active");
                // $(this).addClass("active")
                $(window).trigger("nav_change", id);

                if ($(this).attr("data-scrollto")) {
                    $('html,body').animate({
                        scrollTop: $("#" + $(this).attr("data-scrollto")).offset().top - 20
                    }, 500, function() {
                        $(".onsale-tab-bigitem").removeClass("active");
                        $(self.parentNode).addClass("active")
                    });
                }
                var self = this;

            });



            $(".onsale-tab-item:not(hidden)").each(function(i, tab) {
                if ($("#" + $(tab).attr("data-scrollto")).length) {
                    Souche.Util.appear("#" + $(tab).attr("data-scrollto"), function() {
                        $(".onsale-tab-item").removeClass("active")
                        $(tab).addClass("active")
                    }, $(window).height() - 100, true)
                }

            })
            $(".float-nav-item").on("click", function(e) {
                var id = $(this).attr("data-id");
                $(".onsale-content-item").addClass("hidden")
                $("#" + id).removeClass("hidden");
                $(".float-nav-item").removeClass("activeNav");
                $(this).addClass("activeNav")
                $(window).trigger("nav_change", id);
                e.preventDefault();
            });
            var picsLoaded = false;
            var brandHistoryLoaded = false;
            $(window).on("nav_change", function(e, id) {
                if (id == "onsale_pics") {
                    if (!picsLoaded) {
                        $("#onsale_pics img").lazyload();



                        picsLoaded = true;
                    }

                } else if (id == "onsale_brand") {
                    if (!brandHistoryLoaded) {

                        self.init_brandHistory();


                        brandHistoryLoaded = true;
                    }
                } else if (id == "onsale_koubei") {

                }
            });
            if (SVGsupported && config.showChart) {
                self.load_price();
                self.load_baoyang();
                self.load_koubei();
            }

        }
    }
});
(function() {

    $(".apply_close, .popup-sure").live("click", function() {
        $(".apply_popup").addClass("hidden");
        $('.wrapGrayBg').hide();
    });

    $("#link-to-fenqi").click(function() {
        $("#fenqi-popup").removeClass("hidden");
        $(".wrapGrayBg").show();
        return false;
    });

    $("#detailDoor .tab-item").mouseenter(function() {
        var $this = $(this);
        var index = $this.index();
        var target = null;
        var active = $(".tab-content-active");

        $(".tab-item-active").removeClass("tab-item-active");
        $this.addClass("tab-item-active");
        switch (index) {
            case 0:
                target = $("#J_tabService");
                break;
            case 1:
                target = $("#J_tabCqi");
                break;
            default:
                target = $("#J_tabAddr");
        }
        if (target.attr("class").indexOf("tab-content-active") == -1) {
            target.addClass("tab-content-active");
            active.removeClass("tab-content-active");
        }
    });

    $("#detailDoor .tab-item").mouseenter(function() {
        var $this = $(this);
        var index = $this.index();
        var target = null;
        var active = $(".tab-content-active");

        $(".tab-item-active").removeClass("tab-item-active");
        $this.addClass("tab-item-active");
        switch (index) {
            case 0:
                target = $("#J_tabService");
                break;
            case 1:
                target = $("#J_tabCqi");
                break;
            default:
                target = $("#J_tabAddr");
        }
        if (target.attr("class").indexOf("tab-content-active") == -1) {
            target.addClass("tab-content-active");
            active.removeClass("tab-content-active");
        }
    });
    //分期付款
    var phoneReg = /^1[3458][0-9]{9}$/;
    var $arrowTime = $("#arrow-time"),
        $mortgage = $("#arrow-mortgage"),
        $arrowrate = $("#arrow-rate"),
        $interest = $("#arrow-rate").attr('interest'),
        $fenqiList = $("#fenqi_list"),
        $fenqiTime = $("#fenqi_list li"),
        $fenqiTimeWrap = $("#fenqi-wrap");
    $fenqiMort = $("#fenqi-mort")

    var changeArrow = function(time) {
        var timeArrow, mortArrow,
            str = "fenqi-arrow arrow";
        if ($interest == "1") {
            switch (time) {
                case "6":
                    timeArrow = "0";
                    mortArrow = "3";
                    break;
                case "12":
                    timeArrow = "1";
                    mortArrow = "2";
                    break;
                case "24":
                    timeArrow = "2";
                    mortArrow = "1";
                    break;
                case "36":
                    timeArrow = "3";
                    mortArrow = "4";
                    break;
            }
        } else {
            switch (time) {
                case "12":
                    timeArrow = "1";
                    mortArrow = "3";
                    break;
                case "24":
                    timeArrow = "2";
                    mortArrow = "2";
                    break;
                case "36":
                    timeArrow = "3";
                    mortArrow = "1";
                    break;
            }
        }

        $arrowTime.attr("class", str + timeArrow);
        $mortgage.attr("class", str + mortArrow);
    };

    $("#fenqi_select").click(function(event) {
        $fenqiList.show();
        event.stopPropagation();
    });
    $("body, html").click(function() {
        $fenqiList.hide();
    });
    $fenqiTime.click(function() {
        var $this = $(this),
            time = $this.attr("time"),
            mortgage = $this.attr("mortpay"),
            rate = $this.attr("rate"),
            text = $this.text();

        $fenqiTimeWrap.text(text);
        $arrowrate.text(rate);
        $fenqiMort.text(mortgage);
        changeArrow(time);
    });
    //在线咨询
    var dialogGetMes = $("#dialog-getMes"),
        afterSubmit = $("#dialog-showMes, #dialog-apply2"),
        dialogLoginRemind = $("#dialog-login").find(".dialog-user-remind"),
        dialogRegRemind = $("#dialog-reg").find(".dialog-user-remind"),
        showPrice = $("#dialog-showPrice"),
        showText = $("#dialog-showText"),
        priceVal = $("#dialog-priceVal"),
        salePrice = $("#dialog-apply1").attr("price"),
        textVal = $("#dialog-textVal");

    //取得用户填写的信息
    var showMes = function() {
        showPrice.text(priceVal.val());
        showText.text(textVal.val());
        afterSubmit.removeClass("hidden");
    };

    //是否超过字数
    var mesNum = $("#dialog-mes-num");
    $("#dialog-textVal").keyup(function() {

        var length = $(this).val().length;
        mesNum.text(length);
        if (length >= 250) {
            //$(this).attr("disabled",true);
        }
    })
    //发送到微信or手机
    var submitToPhoneNew = function() {
        $.ajax({
            url: SaleDetailConfig.api_sendCarToPhone,
            data: {
                carId: SaleDetailConfig.carId,
                phone: $("#send-phone").val()
            },
            type: "post",
            success: function(data) {
                $("#send-phone-submit").addClass("hidden");
                $(".send-success").removeClass("hidden");
                window.setTimeout(function() {
                    $(".wx-open").addClass("hidden");
                }, 2000);
            }
        })
    }
    $(".detail-share #J_wx_phone").click(function(e) {
        e.stopPropagation();
        $(".wx-open").removeClass("hidden");
    });
    $(document.body).click(function() {
        $(".wx-open").addClass("hidden");
    });
    $("#send-phone-form").on("submit", function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#send-phone").val())) {
            $(".warning", this).removeClass("hidden");
            return
        } else {
            $(".warning", this).addClass("hidden");
            submitToPhoneNew();
        }
    })
    //
    // $(".detail-share .wx").click(function(e) {
    //     e.stopPropagation()
    //     $("#wx-popup").removeClass("hidden").css({
    //         left: $(".detail-share .wx").offset().left - 98,
    //         top: $(".detail-share .wx").offset().top - 210
    //     })
    //     $("#wx-popup img").attr("src", $("#wx-popup img").attr("data-src"))
    // });
    // $(document.body).click(function() {
    //     $("#wx-popup").addClass("hidden")
    // });
    var submitToPhone = function() {
        $.ajax({
            url: $("#ph-form")[0].action,
            data: {
                carId: SaleDetailConfig.carId
            },
            type: "post",
            success: function(data) {
                $('body').append(data);
                $(".wrapGrayBg").show();
                $("#ph-popup").addClass("hidden")
                $("#ph-result-popup").removeClass('hidden');
            }
        })
    }
    $(".detail-share .ph").click(function() {
        $("#ph-popup .popup-title").html("保存到手机")
        $("#ph-popup .apply_close").attr("click_type", SaleDetailConfig.sendCarClose)
        $("#ph-popup .ph-submit").attr("click_type", SaleDetailConfig.sendCarSubmit)
        $("#ph-popup .tip").html("车辆内容会以短信方式保存到您的手机")
        $("#ph-form")[0].action = SaleDetailConfig.api_sendCarToPhone
        Souche.checkPhoneExist(function(is_login) {
            if (is_login) {
                submitToPhone();
            } else {
                $("#ph-popup").removeClass("hidden")
                $(".wrapGrayBg").show();
            }
        })
    })
    $("#ph-form").on("submit", function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#ph-phone").val())) {
            $(".warning", this).removeClass("hidden");
        } else {
            Souche.PhoneRegister($("#ph-phone").val(), function() {
                submitToPhone();
            })

        }
    })
    $("#ph-phone").blur(function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#ph-phone").val())) {
            $(".warning", $("#ph-form")).removeClass("hidden");
        } else {
            $(".warning", $("#ph-form")).addClass("hidden");
            $(".phone-true").removeClass("hidden");
        }
    })
    // $(".send_addr_tophone").click(function() {
    //     $("#ph-popup .popup-title").html("发地址到手机")
    //     $("#ph-popup .tip").html("输入手机号码，即可发送")
    //     $("#ph-popup .apply_close").attr("click_type", SaleDetailConfig.sendAddressClose)
    //     $("#ph-popup .ph-submit").attr("click_type", SaleDetailConfig.sendAddressSubmit)
    //     $("#ph-form")[0].action = SaleDetailConfig.api_sendAddressToPhone
    //     Souche.checkPhoneExist(function(is_login) {
    //         if (is_login) {
    //             submitToPhone();
    //         } else {
    //             $("#ph-popup").removeClass("hidden")
    //             $(".wrapGrayBg").show();
    //         }
    //     })
    // })
    //门店地址
    $(".car-adress .send-adress").mousemove(function() {
        $(".adress-open").removeClass("hidden");
    })
    $(document.body).on("click", function(e) {
        if (!$(e.target).closest(".adress-open").length) {
            $(".adress-open").addClass("hidden");
        }
    })
    var submitAddress = function() {
        $.ajax({
            url: SaleDetailConfig.api_AddressToPhone,
            data: {
                phone: $("#address-phone").val()
            },
            type: "post",
            success: function() {
                $(".adress-open").addClass("hidden");
            }
        })
    }
    $("#adress-from").on("submit", function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#address-phone").val())) {
            alert("请输入正确手机号码");
        } else {
            submitAddress();
        }
    })
    var submitJiangjia = function() {
            $.ajax({
                url: $("#jiangjia-form").attr('action'),
                data: $("#jiangjia-form").serialize(),
                success: function(data) {
                    if (data.errorMessage) {
                        alert(data.errorMessage)
                    } else {
                        $("#jiangjia-popup").addClass("hidden");
                        $("#jiangjia-success-popup").removeClass("hidden");
                        $(".wrapGrayBg").show();
                    }
                }
            })
        }
        //车牛车辆举报
    $(".detail-share .rep").click(function(e) {
        $(this).closest(".report").addClass("report-active");
        $(".report-open").removeClass("hidden");
        e.stopPropagation();
    });
    $(document.body).on("click", function(e) {
        if (!$(e.target).closest(".report-open").length) {
            $(".report-open").addClass("hidden");
            $(".report").removeClass("report-active");
        }
    });

    var submitReport = function() {
        $.ajax({
            url: "http://niu.souche.com/open/inform_car",
            data: {
                carId: SaleDetailConfig.carId,
                reason: $(".report-input:checked").val(),
                userId: "#",
            },
            dataType: "json",
            type: "post",
            success: function() {
                $(".report-open").addClass("hidden");
                $(".rep").addClass("hidden");
                $(".has-rep").removeClass("hidden");
            }
        })
    };
    $(".report-form").on("submit", function(e) {
        e.preventDefault();
        submitReport();
        $(".report-open").addClass("hidden");
        $(".rep").addClass("hidden");
        $(".has-rep").removeClass("hidden");
        $(".share-item").removeClass("report-active");
    })
    //车牛车辆举报 end
    //降价通知提交
    $("#jiangjia-form").submit(function(e) {
        e.preventDefault();
        if (!phoneReg.test($("#jiangjia-phone").val())) {
            $(".warning", this).removeClass("hidden");
            return;
        }
        Souche.PhoneRegister($("#jiangjia-phone").val(), function() {

            submitJiangjia();
        })
    })
    $("#J_jiangjia").on("click", function() {
        // Souche.checkPhoneExist(function(is_login) {
        //          if(is_login){
        //              submitJiangjia();
        //          }else{
        $("#jiangjia-popup").removeClass("hidden");
        $(".wrapGrayBg").show();
        //          }
        // })
    });
    Bimu.form.selfValidate("J_dialogForm", "dialog-sendMes", function() {
        if (!(/^\+?[1-9][0-9]*$/.test(priceVal.val()))) {
            $("#price-valid").show();
            return false;
        }

        if (parseInt(priceVal.val()) >= parseInt(salePrice)) {
            $("#price-illegal").show();
            return false;
        }
        var content = $("#dialog-textVal").val();
        if (content && content.length > 250) {
            $("#content-valid").show();
            return false;
        }
        $("#content-valid").hide();
        $("#price-illegal").hide();
        $("#price-valid").hide();
        //是否登录
        $.ajax({
            url: contextPath + "/pages/evaluateAction/isLogin.json",
            type: "post",
            dataType: "json",
            async: false,
            success: function(data) {
                if (data.result == "true") {

                    ///
                    Bimu.ajax.formPost("J_dialogForm", function() {
                        showMes();
                        afterSubmit.removeClass("hidden");
                        dialogGetMes.removeClass("dialog-error").addClass("hidden");
                        $(".zixun-main").scrollTop($(".zixun-main").height())
                    });
                    ///
                    return true;
                } else {
                    dialogGetMes.addClass("dialog-error");
                    $(".zixun-main").scrollTop($(".zixun-main").height())
                    return false;
                }
            },
            error: function() {
                dialogGetMes.addClass("dialog-error");
                $(".zixun-main").scrollTop($(".zixun-main").height())
                return false;
            }
        });
    })
    var doubleClickFlag = false;
    // var submitFav = function() {
    //     $.ajax({
    //         url: SaleDetailConfig.api_saveFavorite,
    //         data: {
    //             phone: $("#fav-phone").val(),
    //             carType: SaleDetailConfig.carType,
    //             carId: SaleDetailConfig.carId
    //         },
    //         dataType: "json",
    //         type: "post",
    //         success: function(data) {
    //             if (data.errorMessage) {
    //                 alert(data.errorMessage)
    //             } else {
    //                 //$('#shoucang-popup').removeClass('hidden');
    //                 var favPos = $("#J_shoucang").offset();
    //                 $("<div class='icon-fei'></div>").css({
    //                     left: favPos.left + 7,
    //                     top: favPos.top + 7
    //                 })
    //                     .appendTo(document.body)
    //                     .animate({
    //                         left: $(".sidebar").offset().left + 10,
    //                         top: $(".sidebar").offset().top + 10,
    //                         opacity: 0
    //                     }, 700, function() {
    //                         $(".collectside").addClass("flash")
    //                         setTimeout(function() {
    //                             $(".collectside").removeClass("flash")
    //                         }, 500)
    //                     })
    //                 $("#fav-popup").addClass("hidden")
    //                 $(".wrapGrayBg").hide();
    //                 $("#J_shoucang label").html('已收藏')
    //                 $("#J_shoucang").attr('value', '1').addClass("faved");
    //                 $("#J_shoucang").attr('value', '1').removeClass("fav");
    //                 var num = $('#J_car_favorite').html();
    //                 $('#J_car_favorite').html(parseInt(num) + 1);
    //                 doubleClickFlag = false;
    //             }
    //         }
    //     })
    // }



    // var cancelFavSubmit = function() {
    //     $.ajax({
    //         url: SaleDetailConfig.api_delFavorite,
    //         data: {
    //             carId: SaleDetailConfig.carId //$(self).attr("data-carid")
    //         },
    //         dataType: "json",
    //         type: "post",
    //         success: function(data) {
    //             $("#J_shoucang label").html('收藏');
    //             $("#J_shoucang").removeClass("faved");
    //             $("#J_shoucang").addClass("fav");
    //             var num = $('#J_car_favorite').html();
    //             $('#J_car_favorite').html(parseInt(num) - 1);
    //             doubleClickFlag = false;
    //         }
    //     })
    // }

    // $(".faved").on("click", function() {
    //     cancelFavSubmit();
    // })
    // $("#fav-form").on("submit", function(e) {
    //     e.preventDefault();
    //     if (!phoneReg.test($("#fav-phone").val())) {
    //         $(".warning", this).removeClass("hidden"); //("请填写正确的手机号码")
    //     } else {

    //         Souche.PhoneRegister($("#fav-phone").val(), function() {
    //             submitFav();
    //         })
    //     }
    // })
    $('#shoucang-popup .apply_close').click(function() {

        $(this).parent().addClass('hidden');
        $(".wrapGrayBg").hide();
    });

    Bimu.form.selfValidate("dialog-login", "dialog-loginBtn", function() {

        //登录验证
        if (!$('#user-phone').val()) {
            dialogLoginRemind.html("请输入手机号");
            return false;
        }
        if (!$('#user-psd').val()) {
            dialogLoginRemind.html("请输入密码");
            return false;
        }
        $("#dialog-loginBtn").val("登陆中...");

        return true;
    }, function(data) {
        if (data.errorMessage == "") {
            Bimu.ajax.formPost("J_dialogForm", function() {
                showMes();
                afterSubmit.removeClass("hidden");
                dialogGetMes.removeClass("dialog-error").addClass("hidden");
            });
        } else {
            dialogLoginRemind.html(data.errorMessage);
        }
        $(".zixun-main").scrollTop($(".zixun-main").height())
    });
    $("#user-phone").blur(function() {
        var phoneT = $(this).val();
        if (!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phoneT) && phoneT.length == 11)) {
            dialogLoginRemind.html("请正确填写手机号码！");
        } else {
            dialogLoginRemind.html("");
        }
    });

    //注册                
    var uuid = guid();
    $("#uuid").val(uuid);

    Bimu.form.validate("dialog-reg", "dialog-regBtn", function(data) {

        if (data.id) {
            if (data.msg) {
                dialogRegRemind.html(data.msg);
            }

            return;
        } else {
            dialogRegRemind.html("");
            $("#user-phone").val($("#user-regPhone").val());
            $("#user-psd").val($("#user-regPsd").val());
            Bimu.ajax.loginForm("dialog-login", function(data) {
                if (data.errorMessage == "") {
                    //登陆       
                    Bimu.ajax.formPost("J_dialogForm", function() {
                        showMes();
                        afterSubmit.removeClass("hidden");
                        dialogGetMes.removeClass("dialog-error dialog-register").addClass("hidden");
                    });
                }
            }, null);
        }

    }, function() {}, {
        noclear: true
    });

    $("#user-regPhone").blur(function() {
        var phoneT = $(this).val();
        if (!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phoneT) && phoneT.length == 11)) {
            dialogRegRemind.html("请正确填写手机号码");
        } else {
            dialogRegRemind.html("");
        }
    });

    function setButtonValue(obj) {
        var interVal = null;
        var phone = $("#user-regPhone").val();
        if (!(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(phone) && phone.length == 11)) {
            dialogRegRemind.html("请正确填写手机号码");
            if (interVal != null)
                clearInterval(interVal);

            obj.attr("disabled", false);
            obj.val("获取验证码");
            return;
        }
        var it = 0;

        obj.attr("disabled", true);

        setTimeout(function() {
            obj.attr("disabled", false);
            if (interVal != null) {
                clearInterval(interVal);
            }
            obj.val("获取验证码");
        }, 60000);

        interVal = setInterval(function() {

            if (it < 60) {
                obj.val((60 - it) + "秒后可重发");
                it++;
            }

        }, 1000);

        var uuid = $("#user-test").val();

        Bimu.ajax.post("sendMessageAction", "sendMessage", {
            phoneNumber: phone,
            type: "register",
            uuid: uuid
        }, function(data) {
            if (data.id) {
                dialogRegRemind.html("该手机号码已经注册");
                if (interVal != null) {

                    clearInterval(interVal);
                }
                obj.val("获取验证码");
                obj.attr("disabled", false);
            } else {
                dialogRegRemind.html("");
            }
        }, function() {});
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    $(".dialog-get-yz").click(function() {
        setButtonValue($(this));
    })

    $("#J_zixunPrice").click(function() {
        $("#dialog-apply1,#dialog-getMes").removeClass("hidden").slideDown(200);
        afterSubmit.addClass('hidden');
        $('#dialog-priceVal').val('');
        $("#dialog-textVal").val('');
        $(".zixun-main").scrollTop($(".zixun-main").height())
    });
    //  $(".J_linkShangqiao").click(function(){
    //      $("#bridgehead").trigger("click");
    //  });
    $(".J_linkShangqiao").mouseenter(function() {
        $(".shangqiao-remind", this.parentNode).show();
    }).mouseleave(function() {
        $(".shangqiao-remind", this.parentNode).hide();
    });
    $("#link-reg").click(function() {
        $("#dialog-getMes").addClass("dialog-register");
        return false;
    });
    $("#link-login").click(function() {
        $("#dialog-getMes").removeClass("dialog-register");
        return false;
    });
})();
//买车顾问弹出
$(".advisor-close").click(function() {
    $(".advisor-unfold").addClass("hidden");

});
$(".advisor-unfold").click(function() {
    $(".advisor-unfold").animate({
        width: "820px",
        height: "400px",
        bottom: "10px"
    }, 800)
});
var phoneReg = /^1[3458][0-9]{9}$/;
$(".unfold").on("submit", function(e) {
    e.preventDefault();
    if (!phoneReg.test($("#unfold-phone").val())) {
        $(".input-error-tip").removeClass("hidden")
        return;
    }
    Souche.PhoneRegister($("#unfold-phone").val(), function() {
        window.location.href = contextPath + "/pages/onsale/match_car_list.html"
    })
});
//查看大图
(function() {
    var bigImages = null;
    var iframe = null;
    var index = 0;
    var appendIframe = function(index) {
        if (bigImages) {
            iframe.Slider.setCurrent(index);
            bigImages.css("display", "block");
        } else {
            bigImages = $("<iframe name='bigImages' id='bigImages' allowtransparency='true' frameborder='no' border='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>");
            bigImages.attr("src", SaleDetailConfig.api_bigImg);
            bigImages.css({
                display: "none",
                position: "fixed",
                top: 0,
                left: 0,
                background: "#000",
                width: "100%",
                height: $(document.body).height(),
                zIndex: 1000000000000
            })
            $(document.body).append(bigImages);
            iframe = window.frames['bigImages'];
            $(iframe).load(function() {
                iframe.Slider.init({
                    viewHeight: $(window).height()
                });
                iframe.Slider.setCurrent(index);
                bigImages.css("display", "block");
            })
        }
    }
    $("#onsale_detail .photosWrap").click(function(event) {
        var target = event.target;
        if (target.nodeName == "IMG") {
            index = $(target).parent().index();
            appendIframe(index);
        }
    });
    $("#onsale_detail .showBig").click(function() {
        appendIframe(0);
    });
})()
Souche.Detail = Souche.Detail || {}
Souche.Detail.PriceDown = function() {
    var carPrice, nowPrice, nowStr, start, end
    return {
        init: function(config) {
            carPrice = parseInt($('.price-now.now').text());
            nowPrice = carPrice - 1000;
            nowStr = nowPrice.toString();
            start = '<div class="price-num"><em>'
            end = '</em></div>';
            for (var i = 0; i < nowStr.length; i++) {
                $('.cutprice').append(start + nowStr.charAt(i) + end);
            }
            $('#expectedPrice').val((nowPrice / 10000).toFixed(2));

            $("#jiangyidian").click(this.downPriceStep)
            // this.downPriceStep();
        },
        downPriceStep: function() {
            if (100 * (carPrice - nowPrice) / carPrice > 5) {
                $("#jiangyidian").css({
                    "background-position": "0 0",
                    'cursor': 'auto'
                });
                $(".price-toolow").removeClass("hidden")
                return;
            }
            var length = nowPrice.toString().length;
            var curIndex = 0;
            var lowPrice = nowPrice - 1000;
            var now_s = nowPrice.toString(),
                low_s = lowPrice.toString();
            var $cutPrice = $('.cutprice');
            $cutPrice.find('.price-num em').fadeOut(function() {
                curIndex++;
                if (curIndex == length)
                    $cutPrice.find('.price-num.hidden').removeClass('hidden')
                $(this.parentNode).remove();
            });
            var s = '<div class="price-num hidden"><em>',
                e = '</em></div>';
            for (var i = 0; i < low_s.length; i++) {
                $cutPrice.append(s + low_s.charAt(i) + e);
            }
            nowPrice -= 1000;
            $('#expectedPrice').val((nowPrice / 10000).toFixed(2));
        }
    }
}();


define('detail/detail_common',["detail/mod/fav", "detail/init_summary"], function(Fav, InitSummary) {
    Souche.DetailCommon = function() {
        var config = {}

        var operationCarDuibi = function(e) {

            var elem = e.srcElement | e.target;
            if (elem) {

            }
            var carID = config.carId;
            if (carID == undefined) {

                return;
            }

            var carconstrastID = $(".addcarduibi input").attr("contrastid");

            if (e.target.tagName == "INPUT") {
                $(".addcarduibi input")[0].checked = !$(".addcarduibi input")[0].checked;
            }
            Souche.MiniLogin.checkLogin(function() {
                if (!$(".addcarduibi input")[0].checked) {

                    var self = this;
                    self.e = e;
                    $.ajax({
                        type: "POST",
                        url: config.api_addContrast,
                        dataType: "json",
                        context: self
                    }).done(function (data) {
                        if (data.result == 2) {
                            $(".addcarduibi input").attr("checked", 'true');

                            var cloneElement = $(".addcarduibi").clone();
                            cloneElement.css({
                                opacity: 0.8,
                                position: 'absolute',
                                top: this.e.pageY + 'px',
                                left: this.e.pageX + 'px',
                                backgroundColor: "#ff5517",
                                color: "#fff"
                            });

                            var endX = $(".side-box .contrast-img").offset().left;
                            var endY = $(".side-box .contrast-img").offset().top;

                            document.body.appendChild(cloneElement[0]);
                            cloneElement.animate({
                                top: endY,
                                left: endX
                            }, 500, function () {
                                cloneElement.remove();
                            });

                            $(".addcarduibi input").attr("contrastid", data.contrastId);

                            return;
                        }
                        if (data.result == -1) {
                            $(".addcarduibi input").attr("checked", 'true');
                            $(this).find(".contrast-waring").html("对比已添加！你不需要继续添加。").removeClass("hidden");
                            var context = $(this);
                            window.setTimeout(function () {
                                context.find(".contrast-waring").addClass("hidden");
                            }, 2000);
                            return;
                        }
                        if (data.result == 1) {
                            $(this).find(".contrast-waring").html("对比栏已满！你可以删除不需要的车辆，再继续添加。").removeClass("hidden");
                            var context = $(this);
                            window.setTimeout(function () {
                                context.find(".contrast-waring").addClass("hidden");
                            }, 2000);
                            return;
                        }
                        $(this).find(".contrast-waring").html("加入对比失败，请刷新页面。").removeClass("hidden");
                        var context = $(this);
                        window.setTimeout(function () {
                            context.find(".contrast-waring").addClass("hidden");
                        }, 2000);
                    });
                } else {
                    if (!carconstrastID) {
                        return;
                    }

                    $.ajax({
                        type: "POST",
                        url: config.api_deleteContrast,
                        data: {
                            cid: $(".addcarduibi input").attr("contrastid")
                        }
                    }).done(function (data) {
                        $(".addcarduibi input").removeAttr("checked");
                        $(".addcarduibi input").removeAttr("contrastid");
                    });
                }
            })
            return false;
        }

        var _bind = function() {
            $(".addcarduibi,.addcarduibi input").on("click", operationCarDuibi);
        }

        return {
            init: function(_config) {
                $.extend(config, _config)
                InitSummary.init(config);
                Fav.init(config);
                // var carPrice = parseInt($('.price-now.now').text());
                // var nowPrice = carPrice;
                // var nowStr = nowPrice.toString();
                // var start = '<div class="price-num"><em>',
                //     end = '</em></div>';
                // for (var i = 0; i < nowStr.length; i++) {
                //     $('.cutprice').append(start + nowStr.charAt(i) + end);
                // }
                Souche.Detail.PriceDown.init(config);
                if ($(".brand-nav").length) {
                    $(window).scroll(function() {
                        var brandNavPos = $(".brand-nav").offset().top;
                        var brandHeight = $(".brand-wrapper").height();
                        var brandNavHeight = $(".brand-nav").height();
                        if ($(window).scrollTop() > brandNavPos + 40) {

                            if ($(window).scrollTop() > brandNavPos + brandHeight - brandNavHeight - 150) {
                                $(".brand-list").css({
                                    position: "absolute",
                                    top: brandHeight - brandNavHeight - 100
                                })
                            } else {
                                $(".brand-list").css({
                                    position: "fixed",
                                    top: 80
                                })
                            }
                        } else {
                            $(".brand-list").css({
                                position: "relative",
                                top: 0
                            })
                        }

                    })
                }

                _bind();


                var navSaleTabTop = $("#onsale_tab").offset().top;
                var navSaleTabHeight = $("#onsale_tab").height();

                $(window).scroll(function() {
                    var winTop = $(window).scrollTop();

                    if (winTop > navSaleTabTop) {
                        $("#onsale_tab").css({
                            position: "fixed",
                            top: 0,

                            zIndex: 1000
                        });
                        $("#onsale_tab_space").removeClass("hidden")
                    } else {
                        $("#onsale_tab").css({
                            position: "relative"
                        })
                        $("#onsale_tab_space").addClass("hidden")
                    }
                    var onSaleHeight = $(".onsale-summary").height();
                    if (winTop > navSaleTabTop + onSaleHeight - 40) {
                        $("#onsale_tab").css({
                            position: "relative"
                        })
                        $("#onsale_tab_space").addClass("hidden")
                    }



                });

            }
        }
    }();
    return Souche.DetailCommon;
});
>>>>>>> b0565e9390f1118c1953740342472db8be18ac88
