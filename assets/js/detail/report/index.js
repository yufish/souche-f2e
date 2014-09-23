define(['detail/report/report-safety',
'detail/report/report-important',
'detail/report/report-control'
], function(Safety,Important, Control){
    Safety.init();
    Important.init();

    var controlConfig = {
        // set auto slide interval here
    };
    Control.init(controlConfig);
    // start auto slide
    // or bind to "appear"
    Control.startAudoSlide();

    //tip的脚本
    var tip_popup = $("<div class='record-tip-popup hidden'><div class='arrow'></div><div class='tip-title'></div><div class='tip-summary'></div></div>");
    tip_popup.appendTo($(".car_report"));
    $(".report-tip").on("mouseover",function(){
        var title = $(this).attr("data-title");
        var summary = $(this).attr("data-summary");
        $(".tip-title",tip_popup).html(title);
        $(".tip-summary",tip_popup).html(summary);
        tip_popup.css({
            left:$(this).offset().left-67,
            top:$(this).offset().top+30
        }).removeClass("hidden")
    })
    $(".report-tip").on("mouseleave",function(){
        tip_popup.addClass("hidden")
    })
});