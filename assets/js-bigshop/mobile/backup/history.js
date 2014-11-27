var History = function() {
    
    var config = {
            queryURL:""
    }
    var historys = []
    var tpl_cars = "";
    var historysObj = {}
    var queryCars = function(){
        var ids = [];
        historysObj = {}
        historys.forEach(function(h){
            if(h&&h.carId){
                ids.push(h.carId)
                historysObj[h.carId]=h
            }
            
            
        })
        if(ids.length==0){
            $(".cars").append("<div class=no>暂无浏览记录</div>")
            return;
        }
        SM.LoadingTip.show("加载中")
        $.ajax({
            url:config.queryURL,
            type:"get",
            data:{
                ids:ids.join(",")
            },
            dataType:"json",
            success:function(data){
                console.log(data)
                
                data.page.items.forEach(function(car){
                    console.log(car)
                    historysObj[car.carVo.id]['car']=car
                })
                buildCars();
                SM.LoadingTip.hide()
            }
        })
        
    }
    //特殊逻辑，按照日期分组
    var buildCars = function(){
        if(historys.length==0){
            $(".cars").append("<div class=no>暂无浏览记录</div>")
            return;
        }
        var today = new Date();
        var todayDay = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
        //从最晚一天开始算
        var date = new Date(historys[0].time)
        var nowDay = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        var cars = []
        
        var pt = false;//用来记录是否都是同一天的记录，如果是最后要手动触发渲染
        historys.forEach(function(h){
            var d = new Date(h.time)
            var day = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
            
            
            if(day!=nowDay){
                $(".cars").append("<div class=date>"+nowDay+(todayDay==nowDay?"（今天）":"")+"</div>")
                var html = Mustache.render (tpl_cars,{cars:cars})
                $(".cars").append(html)
                cars = []
                nowDay = day
            }
            cars.push(historysObj[h.carId]['car'])
            console.log(day)
        })
        $(".cars").append("<div class=date>"+nowDay+(todayDay==nowDay?"（今天）":"")+"</div>")
        var html = Mustache.render (tpl_cars,{cars:cars})
        $(".cars").append(html)
    }
    return {
        init:function(_config){
            for(var i in _config){
                config[i]=_config[i]
            }
            historys = HistoryUtil.getAll();
            historys = historys.sort(function(s1,s2){
                return s1.time<s2.time;
            })
            console.log(historys)
            tpl_cars = $("#tpl_cars").html();
            queryCars();
        }
    }
}();