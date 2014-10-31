define(function(){
    function init( shopLocation, zoomLevel ){
        // 百度地图API功能
        var map = new BMap.Map("shop-map");
        //- 店铺经纬度
        var point = new BMap.Point( shopLocation.log, shopLocation.lat);
        var marker = new BMap.Marker(point);  // 创建标注
        // 比例值
        var ruler = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
        map.addOverlay(marker);              // 将标注添加到地图中
        map.centerAndZoom(point, zoomLevel);

        // scale control
        var scaleOpts = {
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        };
        map.addControl(new BMap.NavigationControl(scaleOpts));
        map.addControl(ruler);

        var opts = {
          width : 100,     // 信息窗口宽度
          height: 80,     // 信息窗口高度
          title : "海华二手车精品店" , // 信息窗口标题
          enableMessage:true,//设置允许信息窗发送短息
          message:"大搜车授权店 海华二手车精品店 地址: 浙江省杭州市绍兴路86号"
        }
        // 创建信息窗口对象 
        var infoWindow = new BMap.InfoWindow("地址: 浙江省杭州市绍兴路86号", opts);

        marker.addEventListener("click", function(){          
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        });
    }
    


    return {
        init: init
    }
});