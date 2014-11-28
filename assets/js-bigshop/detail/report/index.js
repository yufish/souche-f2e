define(['detail/report/report-safety',
'detail/report/report-important',
'detail/report/report-control'
], function(Safety,Important, Control){
    Safety.init();
    Important.init();

    var controlConfig = {
        // set auto slide interval here
        interval: 1000*3
    };
    Control.init(controlConfig);
    // start auto slide
    // or bind to "appear"
    Control.startAudoSlide();

    //tip的脚本
    var tip_popup = $("<div class='record-tip-popup hidden'><div class='arrow'></div><div class='tip-title'></div><div class='tip-summary'></div></div>");
    var popup_should_show = true;
    tip_popup.appendTo($(".car_report"));
    $(".report-tip").on("mouseover",function(){
        popup_should_show = true;
        var title = $(this).attr("data-title");
        var summary = $(this).attr("data-summary");
        $(".tip-title",tip_popup).html(title);
        $(".tip-summary",tip_popup).html(summary);
        var pos_x = $(this).offset().left-67;
        var pos_y = $(this).offset().top+30;
        if($(this).offset().left+400>$(window).width()){
            tip_popup.addClass("arrow-right")
            pos_x = $(this).offset().left-337;
        }else{
            tip_popup.removeClass("arrow-right")
            pos_x = $(this).offset().left-67;
        }
        tip_popup.css({
            left:pos_x,
            top:pos_y
        }).removeClass("hidden").stop().animate({
                opacity:1
            },300)
    })
    tip_popup.on("mouseover",function(){
        popup_should_show = true;
        tip_popup.removeClass("hidden")
    })
    tip_popup.on("mouseleave",function(){
        popup_should_show = false;
        setTimeout(function(){
            if(!popup_should_show){
                tip_popup.animate({
                    opacity:0
                },300,function(){
                    tip_popup.addClass("hidden")
                })
            }
        },300)

    })
    $(".report-tip").on("mouseleave",function(){
        popup_should_show = false;
        setTimeout(function(){
            if(!popup_should_show){
                tip_popup.animate({
                    opacity:0
                },300,function(){
                    tip_popup.addClass("hidden")
                })
            }
        },300)
    })

    $(".look").click(function(){
        $(".rule-popup").css({
            left:$(window).width()/2-350,
            top:100
        }).removeClass("hidden")
    })
    $(".rule-popup .close").click(function(){
        $(".rule-popup").addClass("hidden")
    })
});
 //质检等级翻转
var summary_stage_time = 0;
// 只有第type为3的报告才用到翻转
var wapper = $('.wrapper');
if( !wapper.hasClass('report-type-1') && !wapper.hasClass('report-type-2') ){
    $(".level-card").mouseenter(function(){
       if($.browser.msie){
$(".card-rule").removeClass("hidden");
$(".card-cont").addClass("hidden")
       }else{
        $(".card-box").addClass("card-trans");
       }
        
    });
    $(".level-card").mouseleave(function(){
         if($.browser.msie){
$(".card-rule").addClass("hidden");
$(".card-cont").removeClass("hidden")
       }else{
        $(".card-box").removeClass("card-trans");
       }
    });
}
else{
     $(".level-card").unbind('mouseleave');
     $(".level-card").unbind('mouseenter');
}

