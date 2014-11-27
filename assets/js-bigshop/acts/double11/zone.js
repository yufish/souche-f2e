define(function(){
    var _config = {};

    // 精品区 和 五折区
    var dataStore = {
        'choice-car': {},
        'half-off': {}
    };

    var _view = {
        renderCarCard: function(item){
            var htmlStr = '<div class="car"><a href="/pages/choosecarpage/choose-car-detail.html?carId='+ item.carVo.id +'" class="pic" target="_blank">'
            // 图片服务器 + 地址 + 定宽   
            htmlStr += '<img src="http://img.souche.com/'+ item.carPicturesVO.pictureBig +'@240w"></a>';
            htmlStr += '<a href="/pages/choosecarpage/choose-car-detail.html?carId='+ item.carVo.id +'" class="title" target="_blank">'+ item.carVo.carOtherAllNameShow +'</a>';
            htmlStr += '<div class="price">促销价:￥<em>'+ item.price +'</em>万</div>';
            htmlStr += '<div class="n-price"><s>新车价:'+ item.carVo.newPriceToString +'万</s></div>'
            htmlStr += '<a href="" class="go"></a></div>';
            return htmlStr;
        }
    };
    var _data = {
        // 获取五折区不同价格区间的车辆数据
        getZone: function(zoneName, priceRange, callback){
            var stargeParam = {
                'choice-car': 'jingpin',
                'half-off': 'wuzhe'
            };
            // 如果已经缓存过
            if( dataStore[zoneName][priceRange] ){
                setTimeout(function(){
                    callback( dataStore[zoneName][priceRange] );
                }, 20);
            }
            else{
                var param = {
                    carStage: stargeParam[zoneName],
                    carPrice: priceRange
                };
                $.getJSON(_config.zoneUrl, param, function(data, status){
                    if( status =='success' && data.code == '200' ){
                        var carObjArr = data.result;
                        // 缓存起来
                        dataStore[zoneName][priceRange] = carObjArr;
                        callback(carObjArr);
                    }
                    else{
                        alert('获取车辆数据失败, 请稍后重试');
                    }
                });
            }
        }
    };

    var default_jingpin_url = $('#choice-car .look-more a').attr('href');


    var _event = {
        bind: function(){
            $('#half-off .others .price-range-item, #choice-car .others .price-range-item').on('click', _event.priceRange);
        },
        priceRange: function(e){
            var btn = $(this);
            var priceRange = btn.attr('data-pricerange');
            var zoneName= btn.parents('.cars-mod').attr('id');
            if( btn.hasClass('active') ){
                
            }
            else{
                _data.getZone(zoneName, priceRange, function(carObjArr){
                    var htmlStr = '';
                    if( carObjArr.length === 0){
                        htmlStr = '<h2 class="no-car-in-range">没有符合条件的车</h2>'
                    }
                    else{
                        for( var i=0, j=carObjArr.length; i<j; i++ ){
                            htmlStr += _view.renderCarCard(carObjArr[i]);
                        }
                    }
                    
                    $('#'+zoneName+' .car-list').html(htmlStr);
                });

                $('#'+zoneName+' .others .price-range-item').removeClass('active');
                btn.addClass('active');

                if( zoneName == 'choice-car'){
                    $('#choice-car').find('.look-more a').attr('href', default_jingpin_url + '?carPrice='+priceRange );
                }
            }
        }
    };

    function init(config){
        $.extend(_config, config);

        _event.bind();
    }

    return {
        init: init
    };
})