/**
 * Created by zilong on 2014/7/30.
 */
var touch_start = 'click',
    touch_end='click',
    tap_event='click';
if('ontouchstart' in window){
    touch_start = 'touchstart';
    touch_end = 'touchend';
    tap_event='tap';
}
var transition='webkitTransition',
    transform='webkitTransform';
//transition_end = 'webkitTransitionEnd';
if(typeof document.body.style.transform==='string'){
    transition = 'transition';
    transform = 'transform';
    //transition_end='transitionend'
}
var isAndroid = false;
if (navigator.userAgent.match(/Android/i)){
    isAndroid =true;
}

!function(){
    var $win  = $(window);
    //var $cover = $('#J_tabCover');
    var $bannerDom  =$('#J_banner');
    //var $header = $('#J_header-wrapper');
    var placeHolder = $('#J_fixed-placeholder');
    var imgHeight;
    $bannerDom.find('img').load(function(){
        imgHeight = $(this).height();
        placeHolder.css({height:imgHeight+88})
    })
    $win.scroll(function(){
        var winTop = $win.scrollTop();
        if(winTop>imgHeight){
            $bannerDom.addClass('hidden')
        }else{
            $bannerDom.removeClass('hidden');
        }
        //var cTop = $cover.offset().top;
        //var imgHeightTmp = Math.max(imgHeight-winTop,0);
        //$bannerDom.css({height:imgHeightTmp})
        //placeHolder.css({height:imgHeightTmp+88})
        //if(winTop>cTop){
        //    $bannerDom.addClass('hidden');
        //}else{
        //    $bannerDom.removeClass('hidden');
        //}
    })
}()

!function() {
    /*var txt = $(".city-name").text();
    //不是北京地区
    if(txt.indexOf('北京')== -1){
        $('.j_just4bj').remove();
    }*/
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf("micromessenger") != -1){
        $("#J_tab1_name").text('好车推荐')
    }

    $('#J_choose_city').on(touch_start,function(){
        if($('.choose-city').hasClass('hidden')){
            $('.choose-city').removeClass('hidden')
            wrapBg.removeClass('hidden')
        }else{
            $('.choose-city').addClass('hidden')
            wrapBg.addClass('hidden')
        }
    })
    var wrapBg = $('.wrapTransBg');

    wrapBg.on(touch_start,function(){
        $('.choose-city').addClass('hidden')
        $(this).addClass('hidden')
    })

    $('.choose-city-item').click(function(){
        if($(this).hasClass('active')){
            return;
        }
        var url = contextPath+'/pages/toolbarAction/choosePosition.json?'
        var code  =$(this).attr('data-code');
        $.ajax({
            url:url,
            data:{
                position:code
            },
            success:function(){
                window.location.reload();
            }
        })
    })
    $.ajax({
        type: "GET",
        url: contextPath + "/pages/toolbarAction/getAdderssMap.json",
        dataType: "json",
        success: function(data) {
            if (data && data.addressName) {

                $(".city-name").html(data.addressName);
                $(".choose-city-item").removeClass("active");
                $(".choose-city-item[data-code='" + data.provinceCode + "']").addClass("active");
            }
        }
    });

}()
//tab动画的相关实现
!function(){
    var transition_duration=400;
    var tabCover =$('#J_tabCover'),
        tabCtn = $('#J_tabContainer'),
        tabNavBar = $('#J_tabNavbar');
    var tabPanels = tabCtn.find('.tab-panel'),
        navItems = $('.nav-item',tabNavBar);
    var numOfPanels = tabPanels.length;
    var widthOfPanel = 100/numOfPanels;
    tabCtn.css({width:numOfPanels*100+'%'});
    tabPanels.css({width:widthOfPanel+'%'});

    //记录每一个tabPanel的scrollTop，便于恢复到相应位置
    var topCache=[0,0,0];//topCache=[] 即可

    var isMoving = false;
    function afterMove(oldIndex,curIndex){
        if(curIndex!=1){
            $('#buy-app').addClass('hidden')
        }else{
            $('#buy-app').removeClass('hidden')
        }
        navItems.removeClass('active')
        navItems.eq(curIndex-1).addClass('active')
        tabNavBar.attr('data-active-index',curIndex)

        tabPanels.each(function(index,item){
            if(index==curIndex-1){
                $(this).css("height",'auto')
            }else{
                $(this).css('height',610)
            }
        })


        try{
            sessionStorage.setItem('index_tab_index',curIndex);
        }catch(e){}
        topCache[oldIndex-1]=document.body.scrollTop;
        document.body.scrollTop = topCache[curIndex-1];
        setTimeout(function(){
            isMoving = false
        },transition_duration)
        if(curIndex==2){
            setTimeout(function(){
                $('.btn-wrapper-for-filter').removeClass('hidden');
            },transition_duration);
        }else{
            $('.btn-wrapper-for-filter').addClass('hidden')
        }
    }
    var move = function (curIndex) {
        if(isMoving)return;
        isMoving = true;
        var moveIndex = curIndex - 1;
        tabCtn[0].style[transform] = 'translateX(-' + moveIndex * widthOfPanel + '%) translateZ(0)';
        var oldIndex = tabNavBar.attr('data-active-index')
        afterMove(oldIndex, curIndex)
    }
//    var move = function(){
//        if(isAndroid){
//            return function(curIndex) {
//                var moveIndex = curIndex - 1;
//                tabCtn[0].style[transform] = 'translateX(-' + moveIndex * widthOfPanel + '%) translateZ(0)';
//                var oldIndex = tabNavBar.attr('data-active-index')
//                afterMove(oldIndex, curIndex)
//            }
//        }else{
//            return function(curIndex) {
//                var moveIndex = curIndex - 1;
//                setTimeout(function () {
//                    tabCtn[0].style[transform] = 'translateX(-' + moveIndex * widthOfPanel + '%) translateZ(0)';
//                    var oldIndex = tabNavBar.attr('data-active-index')
//                    afterMove(oldIndex, curIndex)
//                }, 0)
//            }
//        }
//    }()

    //回复到上一次的tab
    !function recovTab() {
        try {
            var tabIndex = sessionStorage.getItem('index_tab_index');
            tabIndex = tabIndex || 1;
            //如果cookie中有temp_tab，那么跳到相应的tab。只有1,2,3,4是合法值
            var tabCookie = $.cookie("temp_tab");
            if (tabCookie==1||tabCookie == 2 || tabCookie == 3||tabCookie==4) {
                tabIndex = tabCookie;
                $.removeCookie("temp_tab", {path: "/"})
                //$.cookie('temp_tab',-1)
            }
            tabCtn[0].style['transition'] = 'none'
            tabCtn[0].style['webkitTransition'] = 'none'

            //move(+tabIndex, tabIndex != 2);
            move(+tabIndex);
            setTimeout(function () {
                tabCtn[0].style['transition'] = +'all 0.4s linear'
                tabCtn[0].style['webkitTransition'] = 'all 0.4s linear'
            }, transition_duration)
        } catch (e) {
            console.log(e)
        }
    }()

//    navItems.on('click',function(e){
//        e.preventDefault();
//        e.stopPropagation();
//    })
    navItems.on(touch_end,function(e){
        e.preventDefault();
        //e.stopPropagation();
        var index = +$(this).attr('data-nav-index');
        var curIndex = tabNavBar.attr('data-active-index');
        if(curIndex == index)return;
        move(index);
    })

    //var fixedWrapper = $('.fixed-wrapper');
    //tabCtn.on('swipeLeft',function(e){
    //    e.preventDefault();
    //    fixedWrapper.removeClass('hidden');
    //    var index = +tabNavBar.attr('data-active-index');
    //    if(index==numOfPanels) return;
    //    move(index+1);
    //}).on('swipeRight',function(e){
    //    e.preventDefault();
    //    fixedWrapper.removeClass('hidden');
    //    var index = +tabNavBar.attr('data-active-index');
    //    if(index==1) return;
    //    move(index-1);
    //}).on('swipeUp',function(){
    //    fixedWrapper.addClass('hidden');
    //}).on("swipeDown",function(){
    //    fixedWrapper.removeClass('hidden');
    //})
}()


//点击右上角，相应的抽屉动画
!function(){
    var otherTopic = $('.other-topic');
    var topicItems = $('.topic-item',otherTopic);
    var wrapBg = $('.wrapTransBg');

    wrapBg.on(touch_start,function(){
        hideTopic();
        $('.for-other-topic').attr('data-show-state',0)
    })
    $('.for-other-topic').on("click",function(){
        var self =$(this);
        if(self.attr('data-show-state')=='1'){
            hideTopic();
            self.attr('data-show-state',0)
        }else{
            showTopic()
            self.attr('data-show-state',1)
        }
    })
    topicItems.on("click",function(){
        if($(this).hasClass('not-fold')){
            return;
        }
        setTimeout(function(){
            hideTopic();
            $('.for-other-topic').attr('data-show-state',0)
        },100);

    })
    var numOfTopic = topicItems.length;
    var timeSpan = 100,hGap=44;
    function showTopic(){
        wrapBg.removeClass('hidden');
        var time =0;
        var height = 35;
        topicItems.each(function(index,item){
            setTimeout(function(){
                if(index==numOfTopic-1){
                    height=44*numOfTopic;
                }
                otherTopic.css({height:height});
                height+=hGap;
                $(item).addClass("show");
            },time)
            time+=timeSpan
        })
    }
    function hideTopic(){
        if(otherTopic.height()<10){
            return
        }
        var time =0;
        var height = 50*numOfTopic;
        for(var i = numOfTopic-1;i>-1;i--){
            !function(index){
                setTimeout(function(){
                    topicItems.eq(index).removeClass('show')
                    height-=hGap;
                    otherTopic.css({height:height});
                },time)
            }(i)
            time+=timeSpan;
        }
        setTimeout(function(){
            otherTopic.css({height:0});
            wrapBg.addClass('hidden');
        },timeSpan*numOfTopic)
    }
}()
//筛选相关
var hotBrands_g = {
    "brand-15": "奥迪",
    "brand-20": "宝马",
    "brand-25": "奔驰",
    "brand-27": "本田",
    "brand-29": "标致",
    "brand-30": "别克",
    "brand-41": "大众",
    "brand-49": "丰田",
    "brand-53": "福特",
    "brand-99": "路虎",
    "brand-102": "马自达",
    "brand-108": "迷你",
    "brand-119": "起亚",
    "brand-121": "日产",
    "brand-134": "斯巴鲁",
    "brand-135": "斯柯达",
    "brand-146": "沃尔沃",
    "brand-151": "现代",
    "brand-154": "雪佛兰",
    "brand-155": "雪铁龙"
};
var utils = {
    getAllBrand : function (cb) {
        $.ajax({
            url: contextPath + "/pages/dicAction/loadAllExistBrands.json",
            dataType: "json",
            success: cb
        })
    },
    getSeriesByBrand :function (bCode, cb) {
        $.ajax({
            url: contextPath + "/pages/dicAction/loadExistSeries.json",
            dataType: "json",
            data: {
                type: "car-subdivision",
                code: bCode
            },
            success: cb
        })
    },
    queryCarsCount:function(dataObj,cb){
        $.ajax({
            url: contextPath + '/pages/mobile/listAction/countMatchCars.json?tracktype=0',
            data: dataObj,
            dataType: 'json',
            success: function(data){
                if(data&&data.count){
                    cb(null,data.count)
                }else{
                    cb('数据格式错误',0);
                }

            }
        })
    }
}

var utilsSell = {
    getAllBrand : function (cb) {
        $.ajax({
            url: contextPath + "/pages/dicAction/loadRootLevel.json?type=car-subdivision",
            dataType: "json",
            success: cb
        })
    },
    getSeriesByBrand :function (bCode, cb) {
        $.ajax({
            url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
            dataType: "json",
            data: {
                type: "car-subdivision",
                code: bCode
            },
            success: cb
        })
    }
}


!function(){
    var filterGlobal = {}; //用于本模块中公用变量的传递


    !function buildPrice(minSelect,maxSelect){
        var prices =[5, 8, 12, 16, 20, 25, 30, 50, 70, 100];
        var maxPrice=10000,minPrice=0;

        function makeOption(price,selected){
            selected = selected || false;
            var value = (price==maxPrice||price==minPrice)?'不限':price+'万'
            if(selected) {
                return '<option selected="selected" value="' + price + '">' + value +'</option>'
            }else{
                return '<option value="' + price + '">' + value + '</option>';
            }
        }
        //init options,exported by filterGlobal
        function initPriceOption(){
            maxSelect.empty();
            minSelect.empty();
            var initOption = '';
            prices.forEach(function(item){
                initOption+=makeOption(item);
            })
            minSelect.append(makeOption(minPrice,true)+initOption);
            maxSelect.append(initOption+makeOption(maxPrice,true));
        }
        initPriceOption();

        //两个下拉框的联动
        minSelect.change(function(){
            var maxValue= +maxSelect.val(),
                minValue= +minSelect.val();
            maxSelect.empty();
            var findSelected = false;
            var html = '';
            prices.forEach(function(p){
                if (p > minValue) {
                    if (p == maxValue) {
                        findSelected = true;
                        html += makeOption(p,true)
                    } else {
                        html +=makeOption(p);
                    }
                }
            })
            maxSelect.append(html+makeOption(maxPrice,!findSelected));
        })
        maxSelect.change(function(){
            var maxValue= +maxSelect.val(),
                minValue= +minSelect.val();
            minSelect.empty();
            var findSelected = false;
            var html = '';
            prices.forEach(function(p){
                if(p<maxValue) {
                    if (p == minValue) {
                        findSelected = true;
                        html += makeOption(p,true)
                    } else {
                        html += makeOption(p)
                    }
                }
            })
            minSelect.append(makeOption(minPrice,!findSelected)+html);
        })
        filterGlobal.initPriceOption = initPriceOption;
    }($('#J_minPrice'),$('#J_maxPrice'))

    //品牌车系相关操作
    ;(function brandSeries(){
    
        filterGlobal.selectBrand = '';
        filterGlobal.selectBrandName='';
        filterGlobal.selectSeries = '';
        filterGlobal.selectSeriesName='';

        require(['mobile/index/brand2'], function (Brand){
            
          Brand.init();    

          $('#J_brand').on('click', function() {
            
            $('#brand').removeClass('hidden');
            function getBrand(b, bn, s, sn) {

              $('#J_brand').text(bn + ' ' + sn);
                filterGlobal.selectBrand = b;
                filterGlobal.selectBrandName = bn;
                filterGlobal.selectSeries = s;
                filterGlobal.selectSeriesName= sn;
                filterGlobal.queryCount();
            }
            Brand.bind(getBrand);
          });
        });

        //数量显示
        $('.select-cond').change(function(){
            filterGlobal.queryCount();
        })
    })();
    //
    function buildQueryObj(){
        function getCond(val){return (!!val)?val:'';}
        var dataObj = {};
        dataObj.carBrand = filterGlobal.selectBrand;
        dataObj.carSeries = filterGlobal.selectSeries;
        var year = $('#J_year').val();year = year||'0000'
        dataObj.carYear=year+'-9999';
        dataObj.carPrice = $('#J_minPrice').val()+'-'+$('#J_maxPrice').val();
        dataObj.carMileage = getCond($('#J_mile').val());
        dataObj.carModel = getCond($('#J_model').val());
        dataObj.carEngineVolume = getCond($('#J_volume').val());
        dataObj.transmissionType = getCond($('#J_transmission').val());
        //下面两个属性和值，只为了筛选历史的展示
        dataObj.carBrandName =filterGlobal.selectBrandName;
        dataObj.carSeriesName =filterGlobal.selectSeriesName;
        return dataObj;
    }

    filterGlobal.queryCount =  function(){
        var dObj = buildQueryObj();
        utils.queryCarsCount(dObj,function(err,count){
            $('#J_btnFilter_submit').text('为您找到'+count+'辆车')
        })
    };
    $('#J_btnAdvance').on('click',function(){
        $('#J_advanceWrapper').addClass('hidden');
        $('#J_advancedFilterItems').removeClass('hidden');
    });
    $('#J_btnFilter_submit').on(tap_event,function(e){
        var dObj = buildQueryObj();
        var addr = contextPath + '/pages/mobile/list.html?';
        for (var i in dObj) {
            if(i=='carBrandName'|| i=='carSeriesName')continue;
            addr += (i + '=' + dObj[i] + '&');
        }
        setTimeout(function(){
            window.location.href = addr.substr(0,addr.length-1);
        },50)
        Souche.stats.add_click('index-filter-car');
    });

}();
//加载更多车辆相关
!function(){
    function cardDom(item){
        var d = {
            id: item.id,
            detailUrl: item.carVo.status == 'zaishou' ? contextPath+'/pages/mobile/detail.html?' : contextPath+'/pages/mobile/yushou-detail.html?',
            flashPurchase: item.flashPurchase,
            // fenqi: ( !! item.carPriceVO && item.carPriceVO.fenqi == 1),
            downPrice: ( !! item.flashPurchaseVO) ? item.flashPurchaseVO.totalMasterOutPriceToString * 1000 : undefined,
            favorite: item.favorite,
            favCount: item.count,
            year: item.carVo.yearShow,
            month: item.carVo.monthShow,
            newPrice: item.carVo.newPriceToString,
            levelName: item.carVo.levelName,
            pictureBig: ( !! item.carPicturesVO)?item.carPicturesVO.pictureBig:'',
            carOtherAllNameShow: item.carVo.carOtherAllNameShow,
            price: item.price,
            zaishou: (item.carVo.status == 'zaishou'),
            recommStr: item.recommendReasonStr,
            carOtherAllName:item.carVo.carOtherAllName,
            carShortName:item.carVo.carShortName,
            modelName:item.carVo.simpleModelName
        }
        var activeClass= d.favorite?'active':'';
        var str = '<div class="car-wrapper">'
                + '<a class="car-card" href="'+d.detailUrl+ 'carId='+d.id+'">'
                +    '<img src="'+ d.pictureBig+'">'
                +    '<div class="car-info">'
                +        '<div class="car-introduction">'
                +           '<div class="car-series">'+ d.carShortName+'</div>'
                +           '<div class="other-detail-info">'+ d.modelName+'</div>'
                +        '</div>'
                +        '<div class="car-price"><span class="price-num">'+ d.price+'</span>万</div>'
                +        '<div class="car-time">'+ d.year+'上牌</div>'
                +        '<div class="recommend car-footer">'
                +            '<div class="fav '+activeClass+'" data-id="'+ d.id+'"><span class="star-shape"></span><span class="fav-num">'+ d.favCount+'</span></div>'
                +        '</div>'
                +    '</div>'
                +   '</a>'
                +   '</div>'
        return str;
    }
    var $lookMore = $(".car-area .look-more");
    var cardCtn = $('.car-area .row');
    var pageIndex,moreApi,carsProp;
    //判断是推荐新车还是推荐符合需求的车
    if($lookMore.attr('data-type')=='loadUserRecommendCar'){
        pageIndex=2;
        moreApi ='/pages/mobile/homePageAction/loadUserRecommendCar.json';
        carsProp = 'recommendCars';
    }else{
        pageIndex=1;
        moreApi ='/pages/mobile/homePageAction/loadNewCars.json';
        carsProp='newCars'
    }
    function buildCards(data){
        if(!data || data.code!=200)return;
        var html = "";
        var items = data[carsProp].items;
        for(var i = 0;i<items.length;i++){
            html+=cardDom(items[i]);
        }
        cardCtn.append(html);
        $lookMore.text('加载更多')
        if(data[carsProp].totalPage<=pageIndex){
            $lookMore.hide();
        }
    }

    $lookMore.on('click',function(e){
        $lookMore.text('更多好车加载中...')
        $.ajax({
            url:contextPath+moreApi,
            data:{
                page:pageIndex++
            },
            timeout:10000,
            dataType:'json',
            success:function(data){
                buildCards(data);
                setTimeout(function(){

                    $('#J_tabCover').css({height:$('.tab-panel').eq(0).height()})
                },1000)

            },
            error:function(){
                $lookMore.hide();
            }
        })
    })
}()
//收藏相关代码
!function(){
    var isLogin =false;
    var $curNode;
    function saveCallback($node){
        $('.fixed-wrapper').removeClass('hidden');
        var offset1 = $node.offset();
        var left1 = offset1.left,top1 = offset1.top;
        var offset2 = $('.for-other-topic').offset();
        var left2 = offset2.left,top2 = offset2.top;
        var moveDom = $('<div class="fly-fivestar"></div>');
        moveDom.css({
            left:left1,
            top:top1,
            "z-index":10005
        }).appendTo(document.body).animate({
            left:left2+20,
            top:top2+10
        },700,function(){
            moveDom.remove();
            $('.other-topic .icon-dot').show();
        })
    }
    $('.car-area .row').on('click','.fav',function(e){
        e.preventDefault();
        e.stopPropagation();
        $curNode = $(this);
        if (isLogin) {
            doFav($curNode,saveCallback);
            return;
        }
        SM.checkPhoneExist(function(is_login) {
            if (is_login) {
                doFav($curNode,saveCallback);
                isLogin = true;
            } else {
                $('.wrapGrayBg').removeClass('hidden');
                var $popup = $('.fav-popup');
                $popup.removeClass('hidden').css({'top':document.body.scrollTop+50});
            }
        })
    })
    $('#notify-form').submit(function(e) {
        var phoneReg = /^1[3458][0-9]{9}$/;
        var phoneNum = $("#phone-for-notify").val();
        e.preventDefault();
        if (!phoneReg.test(phoneNum)) {
            alert('请输入正确的手机号码');
        } else {
            SM.PhoneRegister(phoneNum, function() {
                isLogin = true;
                doFav($curNode,function($node){
                    $('.wrapGrayBg').addClass('hidden');
                    $('.mobile-popup').addClass('hidden');
                    saveCallback($node)
                });
            })
        }
    })
}();
$('.wrapGrayBg').on('click',function(){
    $('.filter-popup-wrapper').addClass('hidden');
    $('.wrapGrayBg').addClass('hidden');
    $('.mobile-popup').addClass('hidden');
})
//个人中心相关
!function(){
    document.getElementById('J_gotoCenter').addEventListener('click',function(e){
        e.preventDefault();
        SM.checkPhoneExist(function(is_login) {
            if (is_login) {
                window.location.href=$('#J_gotoCenter').attr('href');
            } else {
                $('.wrapGrayBg').removeClass('hidden');
                var $popup = $('.login-popup');
                $popup.removeClass('hidden').css({'top':document.body.scrollTop+50});
            }
        })
    })

    $('#login-form').submit(function(e) {
        var phoneReg = /^1[3458][0-9]{9}$/;
        var phoneNum = $("#phone-for-login").val();
        e.preventDefault();
        if (!phoneReg.test(phoneNum)) {
            alert('请输入正确的手机号码');
        } else {
            SM.PhoneRegister(phoneNum, function() {
                window.location.href=$('#J_gotoCenter').attr('href');
            })
        }
    })
}();
//加入订阅相关
!function(req_config){
    var apiUrls={
        hasNewReq:contextPath+'/pages/mobile/homePageAction/queryTagTip.json',
        addToReq:contextPath+'/pages/mobile/carCustomAction/saveBuyInfo.json?tagTip=1',
        cancelNewReq:contextPath+'/pages/mobile/homePageAction/closeTagTip.json'
    }

    $.getJSON(apiUrls.hasNewReq,function(e){
        if(e.code!=200){
            return;
        }
        var data={};
        var sCodeList=[],sNameList=[];
        var tags = e.userTags;
        var brands = tags.brands;
        for(var i=0;i<brands.length;i++){
            var brand = brands[i];
            if(brand['type']=="TAGTYPE_SERIES"){
                sCodeList.push(brand['code']);
                sNameList.push(brand['name'])
            }
        }
        //var maxStr='不限',minStr='不限';
        if(sCodeList.length>0){
            data.series = sCodeList.join(',')
        }
        /*
        if(tags['maxPrice']){
            data.maxPrice=tags['maxPrice']/10000;
            maxStr = data.maxPrice+"万";
        }
        if(tags['minPrice']){
            data.minPrice=tags['minPrice']/10000;
            minStr = data.minPrice+"万"
        }
        if(maxStr=='不限'&&minStr=='不限'){
            //do nothing
        }else{
            sNameList.push(minStr+'-'+maxStr);
        }*/
        if($.isEmptyObject(data)){
            return;
        }
        $('.new-sub-content').text(sNameList.join('，'));

        var oldData = req_config.userRequirementJson;
        var saveData = $.extend({},oldData);
        if(data.series){
            if(saveData.series) {
                saveData.series += (',' + data.series);
            }else{
                saveData.series = data.series;
            }
        }
        buildEvent({saveData:saveData})
    })


    function buildEvent(options){
        var subDialog = $('.add-sub-dialog')
        subDialog.removeClass('hidden');
        $('.j_notSub',subDialog).click(function(){
            $.ajax({url:apiUrls.cancelNewReq})
            subDialog.addClass('hidden');
        })
        $('.j_addToSub',subDialog).click(function(){
            $.ajax({
                url:apiUrls.addToReq,
                data:options.saveData,
                success:function(){
                    window.location.reload()
                }
            })
        })
    }
}(req_config)

//buy-app
!function(){
    var buyApp = $('#J_banner')
    $('#J_banner .close').click(function(e){
        e.preventDefault();
        buyApp.hide();
        $('#J_fixed-placeholder').css({'height': 88});
        // $('#J_tabContainer .tab-panel:first-child').css({'margin-bottom':0})
    })
}()



// //sell-car brand-series
// !function(){
//     var sellGlobal = {}

//     function makeBrands(brands) {
//         var b, otherBrandsStr = '';
//         var brandList = $('#brand-list-for-sell');

//         var $otherCtn = brandList.find('#other-brands-for-sell');
//         for (var i = 0; i < brands.length; i++) {
//             b = brands[i];
//             if (!hotBrands_g[b.code]) {
//                 otherBrandsStr += '<div data-code="' + b.code + '" class="item col-1-4"><span class="brand-name">' + b.enName + '</span></div>';
//             }
//         }
//         $otherCtn.append(otherBrandsStr);
//     }
//     function makeSeries(data){
//         var codes = data['codes'];
//         var html = '';
//         for (var i in codes) {
//             //html += '<div class="clearfix" >';
//             html += '<div class="series-title">' + i + '</div ><div class="series-name-wrapper">'
//             var s = codes[i];
//             for (var j in s) {
//                 var b = s[j];
//                 html += '<div class="series-item" data-code="' + b.code + '"><span class="series-name">' + b.name + '</span></div>';
//             }
//             html += '</div>';
//         }
//         $('#series-list-for-sell .series-content').append(html);
//     }
//     $('#J_brand-for-sell').on('click',function(){
//         //显示品牌弹出框
//         $('.wrapGrayBg').removeClass('hidden');
//         $('#brand-list-for-sell').css({
//             top: document.body.scrollTop + 50
//         }).removeClass('hidden');

//         var self = $(this);
//         if(self.attr('hasLoaded'))return;
//         //add hot brands first
//         var hotBrandsStr = '';
//         var $hotCtn = $('#brand-list-for-sell #hot-brands-for-sell');
//         for (var i in hotBrands_g) {
//             hotBrandsStr += '<div data-code = "' + i + '"class = "item col-1-4"><span class="brand-name">' + hotBrands_g[i] + ' </span></div>';
//         }
//         $hotCtn.append(hotBrandsStr);
//         utilsSell.getAllBrand(function(data){
//             self.attr('hasLoaded',true);
//             makeBrands(data.items);
//         })
//     })

//     $('#J_series-for-sell').on('click',function(){
//         if(sellGlobal.selectBrand=='')return;
//         $('.wrapGrayBg').removeClass('hidden');
//         $('#series-list-for-sell').css({
//             top: document.body.scrollTop + 50
//         }).removeClass('hidden');
//     })
//     sellGlobal.selectBrand = '';
//     sellGlobal.selectBrandName='';
//     sellGlobal.selectSeries = '';
//     sellGlobal.selectSeriesName='';
//     $('#brand-list-for-sell').on('click','.item',function(){
//         var self = $(this)
//         //清空车系的状态
//         $('#series-list-for-sell .series-content').empty();
//         $('#J_series-for-sell').text('请先选择品牌').addClass('no-active');
//         sellGlobal.selectSeries = '';
//         sellGlobal.selectSeriesName='';
//         if(self.hasClass('selected')){
//             self.removeClass('selected');
//             $('#J_brand-for-sell').text('选择品牌');
//             sellGlobal.selectBrand = "";
//             sellGlobal.selectBrandName = "";
//         }else{
//             $('#brand-list-for-sell .item').removeClass('selected');
//             self.addClass('selected');
//             setTimeout(function(){
//                 $('.filter-popup-wrapper').addClass('hidden');
//                 $('.wrapGrayBg').addClass('hidden');
//             },200);
//             var bName = self.find('.brand-name').text()
//             var bCode = self.attr('data-code');
//             $('#J_brand-for-sell').text(bName);
//             $('.selected-brand-name').text(bName);
//             sellGlobal.selectBrand = bCode;
//             sellGlobal.selectBrandName = bName;

//             utilsSell.getSeriesByBrand(bCode,makeSeries);
//             $('#J_series-for-sell').text('选择车系').removeClass('no-active')
//         }
//     })
//     $('#series-list-for-sell').on('click','.series-item',function(){
//         var self = $(this);
//         if(self.hasClass('selected')){
//             self.removeClass('selected');
//             $('#J_series-for-sell').text('选择车系');
//         }else{
//             self.find('.series-item').removeClass('selected');
//             self.addClass('selected');
//             setTimeout(function(){
//                 $('.filter-popup-wrapper').addClass('hidden');
//                 $('.wrapGrayBg').addClass('hidden');
//             },200)
//             var sName = self.find('.series-name').text()
//             var sCode = self.attr('data-code');
//             sellGlobal.selectSeries = sCode;
//             sellGlobal.selectSeriesName = sName;
//             $('#J_series-for-sell').text(sName);
//         }
//     })

//     $('#J_sellcar_submit').click(function(){
//         var phoneReg = /^1[3458][0-9]{9}$/;
//         var phoneNum = $('#phonenum-for-sell').val();
//         if(!phoneReg.test(phoneNum)){
//             alert('手机号填写错误，请输入正确的手机号码');
//             return;
//         }
//         var ajaxData= {
//             brand:sellGlobal.selectBrand,
//             series:sellGlobal.selectSeries,
//             // province: $('#J_province option:selected').text(),
//             // city: $('#J_city option:selected').text(),
//             mobile:phoneNum
//         }
//         var actionUrl = contextPath + '/pages/mobile/sellCarAction/savaSellCar.json';

//         $.ajax({
//             url:actionUrl,
//             data:ajaxData,
//             dataType:"json",
//             success:function(data){
//                 if(data.errorMessage){
//                     alert(data.errorMessage)
//                 }else{
//                     alert("提交成功，稍后客服会主动联系您，请确保您注册的手机号可以联系到您。")
//                     //window.location.href="sell-success.html"
//                     $('#J_sellcar_submit').css({
//                         background:'#999'
//                     }).prop("disabled",true)
//                         .text("您已提交成功")

//                     setTimeout(function(){
//                         $('#J_sellcar_submit').css({
//                             background:'#ff571a'
//                         }).prop('disabled',false)
//                             .text('提交')
//                     },1500)
//                 }
//             }
//         })
//     })
// }()

//随便狂狂异步加载
!function(){
    var walkItems = $('.walk-tab-item');


    var actUrl=contextPath + '/pages/mobile/homePageAction/loadThemeActivity.json';

    walkItems.on('click',function(){
        walkItems.removeClass('active')
        var self = $(this);
        self.addClass('active');
        var tagId = self.attr('data-tag-id');
        var curWalkContent = $('.walk-content[data-tag-id='+tagId+']');
        $('.walk-content').addClass('hidden');
        if(curWalkContent.length>0){
            curWalkContent.removeClass('hidden');
        }else{
            $.ajax({
                url:actUrl,
                data:{
                    tagId:tagId
                },
                dataType:'json',
                success:function(e){
                    if(!e.themeActPage){
                        return
                    }
                    var items = e.themeActPage.items;
                    var html='';
                    for(var i=0;i<items.length;i++){
                        var item = items[i]
                        var data = {
                            img_src:item.bannerImage,
                            car_url:contextPath+item.url,
                            act_title:item.name,
                            act_content:item.activityDesc,
                            tag_id:tagId,
                            date_create:item.dateCreate
                        }
                        html+=makeDom(data);
                    }
                    var begin = '<div data-tag-id='+tagId+' class="walk-content">',
                        end = '</div>'
                    $('.walkaround-area').append(begin+html+end);
                }
            })
        }
    })
    function makeDom(data){
        var dateCreate = '';
        if(data.tag_id=='hcrb'){
            dateCreate = data.date_create.trim().substr(5,5).replace('-','/')+' '
        }
        var html =  '<a href="'+data.car_url+'" class="act-card">'
            +           '<img src="'+data.img_src+'" class="banner">'
            +           '<div class="act-title">'+dateCreate+data.act_title+'</div>'
            +           '<div class="act-content">'+data.act_content+'</div>'
            +       '</a>'

        return html;
    }
}()

!function sellcar(){
    var phoneNum = checkUserLocal().phoneNum
    if(phoneNum){
        $('#phonenum-for-sell').val(phoneNum);
    }
}()

!function(){
    function loadProvince(cb){
        var url = contextPath+'/pages/dicAction/loadRootLevel.json?type=area';
        $.ajax({
            url: url,
            dataType:'json',
            success:cb
        })
    }
    function loadCityByProvinceCode(code,cb) {
        var url = contextPath + '/pages/dicAction/loadNextLevel.json?type=area';
        $.ajax({
            url:url,
            dataType:'json',
            data:{
                code:code
            },
            success:cb
        })
    }
    loadProvince(function(e){
        var items = e.items;
        var html='<option value="">不限</option>'
        for(var i = 0;i<items.length;i++){
            var code = items[i].code;
            var name = items[i].enName;
            html+='<option value="'+name+'" data-code='+code+'>'+name+'</option>'
        }
        $('#J_province').html(html);
    })
    $('#J_province').change(function(){
        var code =$('#J_province option:selected').attr("data-code");
        loadCityByProvinceCode(code,function(e){
            var items = e.items
            var html='<option value="">不限</option>'
            for(var i = 0;i<items.length;i++){
                var code = items[i].code;
                var name = items[i].enName;
                html+='<option value="'+name+'">'+name+'</option>'
            }
            $('#J_city').html(html);
        })
    })
}()



// 城市自动选择弹窗
;(function() {
    var $modelCity = $('#city-wrap');

    if (localStorage.getItem('index_city_choose') !== 'hide') {
        $modelCity.removeClass('hidden');
    }

    function closeModel() {
        $modelCity.addClass('hidden');
        localStorage.setItem('index_city_choose', 'hide');
    }

    $modelCity.find('.ft').on('click', closeModel);

    setTimeout(closeModel, 3000);
})();

// 卖车和估价tab切换
;(function () {
    // activeItem = sessionStorage.getItem('index_eval_tab') || 0;
    var activeItem = $('.tab-index span').length ? sessionStorage.getItem('index_eval_tab') : 0;
    $('.tab-index span').removeClass('active').eq(activeItem).addClass('active');
    $('.car-seller-tab .item').addClass('hidden').eq(activeItem).removeClass('hidden');

    $('.car-seller-tab').on('click', '.tab-index span', function() {
        var item = $('.tab-index span').index($(this));
        sessionStorage.setItem('index_eval_tab', item);
        $('.tab-index span').removeClass('active').eq(item).addClass('active');
        $('.car-seller-tab .item').addClass('hidden').eq(item).removeClass('hidden');
    });
})();

/**
 *
 *  todo：把公用方法抽出来
 * 
 */

// 卖车页面
;(function(){

    // 选品牌 ＋ 车型
    require(['mobile/index/brand2'], function (Brand){
    
      $('#sale-brand').on('click', function() {
        
        $('#brand').removeClass('hidden');

        function brandInfo(b, bn, s, sn) {
          $('#sale-brand').attr('data-brand', b).attr('data-series', s)
                .text(bn + ' ' + sn);
          $('#sale-model').removeClass('no-active').text('');
          $('#car-models').empty();

          var modelUrl = contextPath + '/pages/dicAction/loadNextLevel.json?type=car-subdivision';

          $.getJSON(modelUrl, { code: s }, function(data) {
            var obj = {};
            var data = data.items;
            for (var i = 0, len = data.length; i < len; i ++) {
              var t = data[i].name.slice(0,4);
              var d = data[i].name.trim();
              var c = data[i].code;
              if (!obj[t]) {
                obj[t] = [];
              }
              obj[t].push({title: d, code: c});
            }
            createModel(obj);
          });

          // 车型弹窗
          function createModel(obj) {
            $('#car-models').empty();
            var str = '';
            for (var p in obj) {
              // str += '<div class="item"><h4>' + p + '</h4>';
              str += '<div class="item">';
              for (var i = 0, arr = obj[p], len = arr.length; i < len; i ++) {
                str += '<li data-code="' +  arr[i].code + '">' +  arr[i].title + '<span class="left-arrow"></span></li>'
              }
              str += '</div>'
            }
            $('#car-models').append(str);
          }

        }

        Brand.bind(brandInfo);
      });

      // 年月
      function createDate(y) {
        var n = new Date().getFullYear();
        var $form = $('#sale-form');
        var $year = $form.find('.select-year');
        var $month = $form.find('.select-month');
        var month = '';
        var year = '';

        year += '<option value="">年</option>'

        for (var j = y; j < n + 1; j ++) {
          year += '<option value="' + j + '">' + j + '年</option>';
        }

        $year.removeClass('no-active').html(year);

        month += '<option value="">月</option>'
        for (var i = 1; i < 13; i ++) {
            month += '<option value="' + i + '">' + i + '月</option>';
        } 
        $month.removeClass('no-active').html(month);
      }
      
      $('#sale-model').on('click', function() {
        if ($(this).hasClass('no-active')) return;
        $('#car-models').removeClass('hidden');

        $('#car-models').on('click', '.item li', function() {
            $('#car-models .item li').removeClass('active');
            $(this).addClass('active');
            $('#sale-model').attr('data-code', $(this).attr('data-code'));
            $('#sale-model').text($(this).text())
            setTimeout(function() {
                $('#car-models').addClass('hidden');
            }, 500);
            var y = parseInt($(this).text()) - 1;
            createDate(y);
        })
      });
    
    });

    $.getJSON(contextPath + "/pages/toolbarAction/getAdderssMap.json", function(data) {
        Souche.UI.Select.init({
            eles:[ 'J_province_s', 'J_city_s' ],
            type:"area",
            defaultValues:[data.provinceCode,data.cityCode]
        })
    }); 

    // 手机号默认值
    var phoneNum = checkUserLocal().phoneNum
    if(phoneNum){
        $('#sale-phone').val(phoneNum);
    }

    function getData() {
        var obj = {};
        // code
        obj.brand = $('#sale-brand').attr('data-brand');
        obj.series = $('#sale-brand').attr('data-series');
        obj.model = $('#sale-model').attr('data-code');
        obj.province = $('#J_province_s').val();
        obj.city = $('#J_city_s').val() || '';
        obj.mileage = $('#sale-mileage').val();
        if ($('#sale-year').val() && $('#sale-year').val()) {
            obj.firstsdate = $('#sale-year').val() + '-' + $('#sale-month').val();
        }
        obj.mobile = $('#sale-phone').val();
        obj.expectTime = $('#sale-expect').val();
        obj.reason = $('#sale-reason').val();
        return obj;
    }

    $('#sale-form .btn-submit').on('click', function(e) {
        e.preventDefault();
        
        // 验证
        if ($('#sale-brand').text() == '' || $('#sale-model').text() == '' 
            || $('#sale-phone').val() == '') {
            $('#evaluate-model').html('<div class="content"><h6>提交失败</h6><p>请将必填信息补充完整</p><a class="ft">好</div></a>')
            $('#evaluate-model').removeClass('hidden');
            $('.label-need').addClass('active');
            return
        }

        if (($('#sale-year').val() != $('#sale-month').val())
            && ($('#sale-year').val() == '' || $('#sale-month').val() == '')) {
            alert('请同时填写年月信息');
            return
        }

        var mileStr = $("#sale-mileage").val();
        var mileNum = Number(mileStr);
        if (mileNum) {
            // 判断是否为NaN
            if((Boolean(mileNum) == false && mileNum !=0) || mileNum < 0 || mileStr == '' ){
              alert("请正确填写车辆行驶里程");
              return;
            }
        }

        var phoneReg = /^1[34578][0-9]{9}$/;
        var phoneNum = $('#sale-phone').val();
        if(phoneNum && !phoneReg.test(phoneNum)){
            alert('手机号填写错误，请输入正确的手机号码');
            return;
        }

        var actionUrl = contextPath + '/pages/mobile/sellCarAction/savaSellCar.json';
        var obj = getData();

        $.ajax({
            url: actionUrl,
            data: obj,
            success: function() {
                $('#evaluate-model').html('<div class="content"><h6>成功提交</h6><p>工作人员会在24小时内和您联系如有疑问可咨询：4008-010-010</p><a class="ft">好</a></div>')
                $('#evaluate-model').removeClass('hidden');
            }
        });
    });

})();


// 估价页面
;(function(){

    // 选品牌 ＋ 车型
    require(['mobile/index/brand2'], function (Brand){
    
      $('#evaluate-brand').on('click', function() {
        
        $('#brand').removeClass('hidden');

        function brandInfo(b, bn, s, sn) {
          $('#evaluate-brand').attr('data-brand', b).attr('data-series', s)
                .text(bn + ' ' + sn);
          $('#car-model').removeClass('no-active').text('');
          $('#car-models').empty();

          var modelUrl = contextPath + '/pages/dicAction/loadNextLevel.json?type=car-subdivision';

          $.getJSON(modelUrl, { code: s }, function(data) {
            var obj = {};
            var data = data.items;
            for (var i = 0, len = data.length; i < len; i ++) {
              var t = data[i].name.slice(0,4);
              var d = data[i].name.trim();
              var c = data[i].code;
              if (!obj[t]) {
                obj[t] = [];
              }
              obj[t].push({title: d, code: c});
            }
            createModel(obj);
          });

          // 车型弹窗
          function createModel(obj) {
            $('#car-models').empty();
            var str = '';
            for (var p in obj) {
              // str += '<div class="item"><h4>' + p + '</h4>';
              str += '<div class="item">';
              for (var i = 0, arr = obj[p], len = arr.length; i < len; i ++) {
                str += '<li data-code="' +  arr[i].code + '">' +  arr[i].title + '<span class="left-arrow"></span></li>'
              }
              str += '</div>'
            }
            $('#car-models').append(str);
          }

        }

        Brand.bind(brandInfo);
      });

      // 年月
      function createDate(y) {
        var n = new Date().getFullYear();
        var $form = $('#evaluate-form');
        var $year = $form.find('.select-year');
        var $month = $form.find('.select-month');
        var month = '';
        var year = '';

        year += '<option value="">年</option>'

        for (var j = y; j < n + 1; j ++) {
          year += '<option value="' + j + '">' + j + '年</option>';
        }

        $year.removeClass('no-active').html(year);

        month += '<option value="">月</option>'
        for (var i = 1; i < 13; i ++) {
            month += '<option value="' + i + '">' + i + '月</option>';
        } 
        $month.removeClass('no-active').html(month);
      }
      
      $('#car-model').on('click', function() {
        if ($(this).hasClass('no-active')) return;
        $('#car-models').removeClass('hidden');

        $('#car-models').on('click', '.item li', function() {
            $('#car-models .item li').removeClass('active');
            $(this).addClass('active');
            $('#car-model').attr('data-code', $(this).attr('data-code'));
            $('#car-model').text($(this).text())
            setTimeout(function() {
                $('#car-models').addClass('hidden');
            }, 500);
            var y = parseInt($(this).text()) - 1;
            createDate(y);
        })
      });
    
    });


    // 地区联动
    Souche.UI.Select.init({
        eles:[ 'J_province_e', 'J_city_e' ],
        type:"area",
        defaultValues:[]
    })


    // 手机号默认值
    var phoneNum = checkUserLocal().phoneNum
    if(phoneNum){
        $('#evaluate-phone').val(phoneNum);
    }

    function getData() {
        var serilal = $('#evaluate-form').serialize();
        var ss = serilal.split("&");
        var obj = {}
        for(var i=0;i<ss.length;i++){
          var kv = ss[i].split("=")
          obj[kv[0]]=kv[1]
        }

        var brand = $('#evaluate-brand').text();
        var arr = brand.split(' ');
        obj.brand = arr[0];
        obj.series = arr[1];
        obj.model = $('#car-model').text();
        obj.province = $('#J_province_e option:selected').text();
        obj.city = $('#J_city_e option:selected').text();

        // code
        obj.brand_code = $('#evaluate-brand').attr('data-brand');
        obj.series_code = $('#evaluate-brand').attr('data-series');
        obj.model_code = $('#car-model').attr('data-code');
        obj.province_code = $('#J_province_e').val();
        obj.city_code = $('#J_city_e').val();
        return obj;
    }

    $('#evaluate-form .btn-submit').on('click', function(e) {
        e.preventDefault();
        var obj = getData();
        // 验证
        if (!$('#evaluate-brand').attr('data-brand') || !$('#car-model').attr('data-code')
            || $('#evaluate-year').val() == '' || $('#evaluate-month').val() == '' 
            || $('#J_province_e').val() == '' || $('#J_city_e').val() == '') {
            
            alert('所有信息都是必填项，请认真填写！'); 
            return;
        }

        var mileStr = $("#evaluate-mileage").val();
        var mileNum = Number(mileStr);
        // 判断是否为NaN
        if((Boolean(mileNum) == false && mileNum !=0) || mileNum < 0 || mileStr == '' ){
          alert("请正确填写车辆行驶里程");
          return;
        }

        var phoneReg = /^1[34578][0-9]{9}$/;
        var phoneNum = $('#evaluate-phone').val();
        if(phoneNum && !phoneReg.test(phoneNum)){
            alert('手机号填写错误，请输入正确的手机号码');
            return;
        }

        var vlidateUrl = contextPath + '/pages/mobile/homePageAction/checkCanEvaluate.json';

        $.getJSON(vlidateUrl, obj, function(data) {
            var $modal = $('#evaluate-model');
            if (data.result == 'fail') {
                var value = JSON.stringify(obj);
                sessionStorage.setItem('evaluate_obj',value);
                $modal.html('<div class="content"><h6>抱歉</h6><p>暂不支持此车型估价，您可以选择其他车型重新进行估价。</p><div class="ft">我知道了</div></div>');
                $modal.removeClass('hidden');
                setTimeout(function() {
                    $modal.addClass('hidden');
                }, 2000);
            } else {
                var value = JSON.stringify(obj);
                sessionStorage.setItem('evaluate_obj',value);
                window.location.href="evaluate_result.html?"
                    +(function(){
                        var params = "";
                        for(var i in obj){
                            params += i + "=" + obj[i] + "&";
                        }
                        return params;
                    })();
            }
        });
    });

})();

// 估价页面返回数据填充
;(function() {
    var obj = JSON.parse(sessionStorage.getItem('evaluate_obj'));
    if (obj) {
        $('#evaluate-brand').text(obj.brand + ' ' + obj.series);
        $('#car-model').text(obj.model).removeClass('no-active');

        $('#evaluate-mileage').val(obj.mileage);
        $('#evaluate-year').html('<option value="' + obj.year + '">' + obj.year + '</option>');
        $('#evaluate-month').html('<option value="' + obj.date + '">' + obj.date + '</option>');

        $('#evaluate-brand').attr('data-brand', obj.brand_code);
        $('#evaluate-brand').attr('data-series', obj.series_code);
        $('#car-model').attr('data-code', obj.model_code);

        $('#J_province_e').html('<option value="' + obj.province_code + '">' + obj.province + '</option>');
        $('#J_city_e').html('<option value="' + obj.city_code + '">' + obj.city + '</option>');

        var modelUrl = contextPath + '/pages/dicAction/loadNextLevel.json?type=car-subdivision';

        $.getJSON(modelUrl, { code: obj.series_code }, function(data) {
            var obj = {};
            var data = data.items;
            for (var i = 0, len = data.length; i < len; i ++) {
              var t = data[i].name.slice(0,4);
              var d = data[i].name.trim();
              var c = data[i].code;
              if (!obj[t]) {
                obj[t] = [];
              }
              obj[t].push({title: d, code: c});
            }
            createModel(obj);
        });

        // 车型弹窗
        function createModel(obj) {
            $('#car-models').empty();
            var str = '';
            for (var p in obj) {
              // str += '<div class="item"><h4>' + p + '</h4>';
              str += '<div class="item">';
              for (var i = 0, arr = obj[p], len = arr.length; i < len; i ++) {
                str += '<li data-code="' +  arr[i].code + '">' +  arr[i].title + '<span class="left-arrow"></span></li>'
              }
              str += '</div>'
            }
            $('#car-models').append(str);
        }

        (function(o) {
            var n = new Date().getFullYear();
            var $form = $('#evaluate-form');
            var $year = $form.find('#evaluate-year');
            var $month = $form.find('#evaluate-month');
            var month = '';
            var year = '';
            var y = parseInt(obj.model) - 1;

            year += '<option value="">年</option>'

            for (var j = y; j < n + 1; j ++) {
                if (obj.year == j) {
                    year += '<option value="' + j + '" selected>' + j + '年</option>';
                } else {
                    year += '<option value="' + j + '">' + j + '年</option>'; 
                }
            }

            $year.removeClass('no-active').html(year);

            month += '<option value="">月</option>'
            for (var i = 1; i < 13; i ++) {
                if (obj.date == i) {
                    month += '<option value="' + i + '" selected>' + i + '月</option>';
                } else {
                    month += '<option value="' + i + '">' + i + '月</option>';
                }
            } 
            $month.removeClass('no-active').html(month);
        })(obj);
    }
})();

$(document).on('click', '#evaluate-model .ft', function() {
    $('#evaluate-model').addClass('hidden');
})



   




