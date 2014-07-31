/**
 * Created by zilong on 2014/7/30.
 */
define(function(){
    var filterUtil = filterUtil || {};
    filterUtil.getAllBrand = function(cb){
        $.ajax({
            url: contextPath + "/pages/dicAction/loadAllExistBrands.json",
            dataType: "json ",
            success: cb
        })
    }
    filterUtil.getSeriesByBrand =function(bCode,cb) {
        $.ajax({
            url: contextPath + "/pages/dicAction/loadExistSeries.json",
            dataType: "json",
            data: {
                type: "car-subdivision",
                code: bCode
            },
            success: cb
        })
    }
    filterUtil.queryCarsCount=function(dataObj,cb){
        $.ajax({
            url: contextPath + '/pages/mobile/listAction/queryCars.json?index=999999&tracktype=0',
            data: dataObj,
            dataType: 'json',
            success: function(data){
                if(data&&data.i){
                    cb(null,data.i)
                }else{
                    cb('数据格式错误',-1);
                }

            }
        })
    }
    return filterUtil;
})
