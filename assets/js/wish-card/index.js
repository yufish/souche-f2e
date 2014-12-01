define([
    'lib/lazyload',
    'wish-card/wish-card-edit',
    'index/collect',
    'souche/util/image-resize',
    'index/guess-like'
    ], function(LazyLoad, WishCardEdit, Collect, ImageResizer, GuessLike){
    

    var _config = {
        guessLikeImgSize: {
            width: 280,
            height: 186
        }
    };

    var _view = {
        init: function(){
            _view.initLazyLoad();
        },
        initLazyLoad: function(){
            var allImgs = $(".wish-card-main img");

            allImgs.lazyload({
                threshold: 200,
                effect : "fadeIn",
                load: function(leftCount){
                    ImageResizer.init('.wish-card-main .carImg img', _config.guessLikeImgSize.width, _config.guessLikeImgSize.height);
                }
            });
        },
        buildCarItem: function(item, index){
            var htmlStr = '';
            htmlStr += '<div click_type="xuqiu-cars-item-xian-' +index+ '" class="carsItem carItem">';
            htmlStr += '<a href="'+item.detailUrl+'" target="_blank" class="carImg">';
            htmlStr += '<img src="' +item.carPicturesVO.pictureBig+ '" alt="' +item.carVo.carOtherAllName+ '" class="img">';
            if( item.flashPurchaseVO ){
                htmlStr += '<div class="timebuy"></div>';
            }
            if( item.carVo.isNewCar==1 ){
                htmlStr += '<div class="whole-new"></div>';
            }
            htmlStr += '</a>';
            htmlStr += '<a href="'+item.detailUrl+'" target="_blank" class="car-link">' +item.carVo.carOtherAllName+ '</a>';
            htmlStr += '<div class="car-price"><span class="price">￥<em>' +item.price+ '</em>万</span></div>';
            htmlStr += '<div class="car-info">';
            if( item.carVo.isNewCar==1 ){
                htmlStr += '<span class="info-item">暂无上牌</span><em>|</em><span class="info-item">0万公里</span><em>|</em><span class="info-item">' +item.carVo.cityName+ '</span>';
            }
            else{
                htmlStr += '<span class="info-item">' +item.carVo.firstLicensePlateDateShowNoDay+ ' 上牌</span><em>|</em><span class="info-item">' +item.carVo.mileageKMShow+ '万公里</span><em>|</em><span class="info-item">' +item.carVo.cityName+ '</span>';
            }
            htmlStr += '</div>';
            htmlStr += '<div class="carTail clearfix"><span data-carid="'+item.carVo.id+ '" data-num="' +item.count+ '" click_type="xuqiu-cars-item-fav-2-'+ index +'" class="collect carCollect ';
            if( item.favorite ){
                htmlStr += 'colled';
            }
            htmlStr += '"><span>' +item.count+ '</span></span>';
            htmlStr += '</div>';
            htmlStr += '<div class="car-type clearfix">';
            if( item.carVo.status == 'zaishou' &&  item.carVo.levelName!=null){
                htmlStr += '<div class="zhijian">检' +item.carVo.levelName+ '</div>'
            }
            if( item.carVo.status == 'zaishou'){
                htmlStr += '<div class="baoxian " title="一年两万公里质保"></div>';
            }
            htmlStr += '<div class="shouquan hidden">授权店</div>';
            htmlStr += '<div class="up-time">' +item.recommendTime+ '</div>';
            htmlStr += '</div>';
            htmlStr += '</div>';

            return htmlStr;
        }
    };

    var _data = {
        getMoreRec: function(pageIndex, callback){
            var param = {
                page: pageIndex
            };
            $.getJSON(_config.getMoreUserRecommend_api, param, callback);
        }
    };

    var pageIndex = 2;

    var _event = {
        bind: function(){
            _event.bindGetMoreRec();
        },
        bindGetMoreRec: function(){
            var getMoreBtn = $('.carsMore');
            if(getMoreBtn.length > 0){
                getMoreBtn.on('click', _event.getMoreRec);
            }
        },
        bindScrollGet: function(){
            // 绑定后 执行一次就会被去掉
            Souche.Util.appear('.carsMore', _event.getMoreRec, -300);
        },
        getMoreRec: function(){
            _data.getMoreRec(pageIndex, function(data, status){
                if( data.code == 200 ){
                    var alreadyHave = $('.myAdviser .carItem').length - 1;
                    var cars = data.recommendCars.items;
                    var carDoms = '';
                    for( var i=0, j=cars.length; i<j; i++ ){
                        var car = cars[i];
                        var index = alreadyHave + i;
                        car.detailUrl = _config.detailPageUrl + car.carVo.id;
                        carDoms += _view.buildCarItem(car, index);
                    }

                    $('.myAdviser').append(carDoms);
                    ImageResizer.init('.wish-card-main .carImg img', 280, 200);
                    // 为下次请求做准备
                    pageIndex++;
                    if( data.hasNext ){
                        _event.bindScrollGet();
                    }
                    else{
                        $('.carsMore span').text('没有更多了...');
                    }
                }
                else{
                    $('.carsMore span').html('获取更多推荐失败');
                }
            });
        }
    }


    function init(config){
        $.extend(_config, config);
        _view.init();
        _event.bind();

        WishCardEdit.init(_config);
        Collect.init(_config);
        GuessLike.init(_config);
    }

    return {
        init: init
    };
});