var HistoryUtil = function(){
    var historyKey = "visit_history";
    var historys;
   
    return {
        add:function(carId){
            if(!carId) return;
            try{
                historys = JSON.parse(localStorage.getItem(historyKey))
                if(!historys||!historys.length) throw new Error("error")
            }catch(e){
                historys = []
            }
            try{
                
                historys.forEach(function(h,i){
                    if(h.carId==carId){
                        historys.splice(i,1)
                    }
                })
                historys.unshift({
                    carId:carId,
                    time:new Date().getTime()
                })
                
                historys = historys.splice(0, 30)
                localStorage.setItem(historyKey,JSON.stringify(historys)) 
                
            }catch(e){
                
            }
            
        },
        getAll:function(){
            try{
                historys = JSON.parse(localStorage.getItem(historyKey))
                if(!historys||!historys.length) throw new Error("error")
            }catch(e){
                historys = []
            }
            return historys
        }
    }
}();