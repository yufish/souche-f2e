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
});