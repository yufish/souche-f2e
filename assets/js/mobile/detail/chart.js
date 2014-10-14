!function(){
    var tap_event = 'click';
    var opTabPanelItems =$('#J_operate_panel .qdc-panel-item');
    var opTabItems = $('#J_operate_tab .qdc-tab-item');
    opTabItems.each(function(index){
        $(this).on(tap_event,function(){
            opTabItems.removeClass('active');
            $(this).addClass('active')
            opTabPanelItems.addClass("hidden");
            opTabPanelItems.eq(index).removeClass("hidden");
        })
    })
    var accTabPanelItems = $('#J_accident_panel .qdc-panel-item');
    var accTabItems  =$('#J_accident_tab .qdc-tab-item');
    accTabItems.each(function(index){
        $(this).on(tap_event,function(){
            accTabItems.removeClass('active');
            $(this).addClass('active')
            accTabPanelItems.addClass("hidden");
            accTabPanelItems.eq(index).removeClass("hidden");
        })
    })
}()
var chartData=[
    {bar1:{value:85},bar2:88,bar3:82,bar4:100,guideline:80},
    {bar1:90,bar2:105,bar3:100,bar4:88,guideline:80},
    {bar1:55,bar2:40,bar3:38,bar4:61,'guideline1':30,'guideline2':70},
    {bar1:60,guideline1:80,guideline2:40,class1:'has-problem-bg'}
]

var barArea = $('.bar-area');

for(var i = 0;i<barArea.length;i++){
    TplRender(barArea.get(i),chartData[i]);
}

