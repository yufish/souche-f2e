define(['souche/util/tool'],function(Tool){
    var _config = {
        carPictureUrl: contextPath + '/pages/carPicsAction/getCarPics.json'
    };

    var _ele = {
        picCtn: $('#onsale_pics')
    };

    var _view = {
        init: function(){

        },
        addLoadingTip: function(){
            _ele.picCtn.html('<h2>正在获取图片数据...</h2>');
        },
        fillPics: function(data){
            var htmlStr = '';
            for( var i=0, j=data.length; i<j; i++ ){
                htmlStr += _view.buildImg( data[i] )
            }
            _ele.picCtn.html(htmlStr);
        },
        buildImg: function(item){
            var src = item.pictureBig;
            return '<img src="http://res.souche.com/images/fed/zhanwei.png" data-original="'+src+'" alt="' + item.altName + '">';
        }
    };

    var _data = {
        getCarPicture: function(carId, callback){
            var param = {
                carId: carId
            };
            $.getJSON(_config.carPictureUrl, param, callback);
        }
    };

    var urlParam = Tool.parseUrlParam();

    function init(){
        _view.init();

        var carId = urlParam.carId;
        _data.getCarPicture(carId, function(data, status){
            if( status == 'success' && data && data.carPics ){
                _view.fillPics( data.carPics );
            }
            else{
                _ele.picCtn.html('<h2>获取车辆图片失败, 请刷新重试</h2>');
            }
        });
    }

    return {
        init: init
    };
});