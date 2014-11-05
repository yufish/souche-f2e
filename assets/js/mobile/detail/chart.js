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

var chartConfig={
    //胎纹深度的最大最小值
    treadMin:1.0,//mm
    treadMax:5,
    treadGuideline:1.6,
    //防冻液的高限和下限
    antiFreezeMax:0,//摄氏度
    antiFreezeUpper:-25,//guideline-1
    antiFreezeLower:-45,//guideline-2
    antiFreezeMin:-65,//应该为-45,为了画图,设为-60
    barHeight:112,//px

    //刹车片只有正常和不正常的状态,写死他们的高度
    brakeOk:85,//px
    brakeDanger:55,
    brakeGuideline:70,
    //液位有正常,偏高,偏低
    fluidGuideline1:30,
    fluidGuideline2:70,
    fluidOk:55,
    fluidHigh:85,
    fluidLow:20,
    problemClass:'has-problem-bg'
}
function createInterpolation(max,min,height){
    var hPerLength = height/(max-min);
    return function(value){
        return (value-min)*hPerLength;
    }
}
//构造胎纹深度的chart
!function treadChart(){
    var treadIpl_high = createInterpolation(chartConfig.treadMax,chartConfig.treadGuideline,80)
    var treadIpl_low = createInterpolation(chartConfig.treadGuideline,chartConfig.treadMin,42)
    function getRealHeight(value){
        if(!value){
            return 80;
        }
        if(value>1.6){
            //大于1.6话,统一改成80高
            return 80;
            //return 42 + treadIpl_high(value)
        }else{
            return treadIpl_low(value);
        }
    }

    var treadDom = $('#J_chart-tread');
    var reporData = treadDom.attr('data-reportdata').split(' ');
    var treadData={
        bar1:getRealHeight(+reporData[0]),
        bar2:getRealHeight(+reporData[1]),
        bar3:getRealHeight(+reporData[2]),
        bar4:getRealHeight(+reporData[3]),
        guideline:42
    }
    treadData.class1 = treadData.bar1<treadData.guideline?chartConfig.problemClass:'';
    treadData.class2 = treadData.bar2<treadData.guideline?chartConfig.problemClass:'';
    treadData.class3 = treadData.bar3<treadData.guideline?chartConfig.problemClass:'';
    treadData.class4 = treadData.bar4<treadData.guideline?chartConfig.problemClass:'';
    treadData.guideY = treadData.guideline-3;
    TplRender(treadDom.get(0),treadData)
}()

//刹车片
!function brakeChart(){
    var brakeDom = $('#J_chart-brake');
    var reportData =  brakeDom.attr('data-reportdata').split(' ');
    var brakeData={
        guideline:chartConfig.brakeGuideline
    }
    for(var i = 0;i<reportData.length;i++){
        if(reportData[i]=='0'){
            brakeData['bar'+(i+1)]= chartConfig.brakeOk;
        }else {
            brakeData['bar' + (i + 1)] = chartConfig.brakeDanger;
            brakeData['class' + (i + 1)] = chartConfig.problemClass
        }
    }
    TplRender(brakeDom.get(0),brakeData)
}()

//液位
!function fluidChart(){
    var fluidDom = $('#J_chart-fluid');
    var reportData =  fluidDom.attr('data-reportdata').split(' ');
    var fluidData={
        guideline1:chartConfig.fluidGuideline1,
        guideline2:chartConfig.fluidGuideline2
    }
    for(var i = 0;i<reportData.length;i++){
        if(reportData[i]=='0'){
            fluidData['bar'+(i+1)]= chartConfig.fluidOk;
        }else {
            fluidData['class' + (i + 1)] = chartConfig.problemClass
            if(reportData[i]=='1'){
                fluidData['bar'+(i+1)]= chartConfig.fluidHigh
            }else{
                fluidData['bar'+(i+1)]= chartConfig.fluidLow
            }
        }
    }
    TplRender(fluidDom.get(0),fluidData)
}()

!function antiFreezeChart(){
    var antiIpl = createInterpolation(chartConfig.antiFreezeMax,chartConfig.antiFreezeMin,chartConfig.barHeight);
    var antiDom = $('#J_chart-anti-freeze');
    var reportData = antiDom.attr('data-reportdata');
    //reportData=-30;
    var antiData={
        bar1:antiIpl(+reportData),
        guideline1:antiIpl(chartConfig.antiFreezeUpper),
        guideline2:antiIpl(chartConfig.antiFreezeLower)
    }
    antiData.guideY1 = antiData.guideline1 - 3;
    antiData.guideY2 = antiData.guideline2 - 3;
    if(antiData.bar1>antiData.guideline1){
        antiData.class1=chartConfig.problemClass;
    }
    TplRender(antiDom.get(0),antiData)
}()

//for(var i = 0;i<barArea.length;i++){
    //TplRender(barArea.get(i),chartData[i]);
//}

