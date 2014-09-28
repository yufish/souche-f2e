var chartData=[
    {bar1:{value:62},bar2:60,bar3:80,bar4:100,guideline:80,class3:'has-problem-bg'},
    {bar1:60,bar2:60,bar3:80,bar4:100,guideline:80,class4:'has-problem-bg'},
    {bar1:60,guideline:60},
    {bar1:60,guideline1:80,guideline2:40,class1:'has-problem-bg'}
]

var barArea = $('.bar-area');

for(var i = 0;i<barArea.length;i++){
    new DdObject(barArea.get(i),chartData[i]);
}

!function(){
    var opTabPanelItems =$('#J_operate_panel .qdc-panel-item');
    $('#J_operate_tab .qdc-tab-item').each(function(index){
        $(this).click(function(){
            opTabPanelItems.addClass("hidden");
            opTabPanelItems.eq(index).removeClass("hidden");
        })
    })
}()