/**
 * Created by zilong on 2014/7/30.
 */
//浏览支持检测
var touch_start = 'click',
    tap_event='click';
if('ontouchstart' in window){
    touch_start = 'touchstart';
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

//tab动画的相关实现
!function(){
    var tabCtn = $('#J_tabContainer'),
        tabNavBar = $('#J_tabNavbar');
    var tabPanels = tabCtn.find('.tab-panel'),
        navItems = $('.nav-item',tabNavBar);
    var underline = $('#J_navbar_underline')
    var numOfPanels = tabPanels.length;
    var widthOfPanel = 100/numOfPanels;
    tabCtn.css({width:numOfPanels*100+'%'});
    tabPanels.css({width:widthOfPanel+'%'});

    //记录每一个tabPanel的scrollTop，便于恢复到相应位置
    var topCache=[0,0,0];

    function afterMove(oldIndex,curIndex){
        navItems.removeClass('active')
        navItems.eq(curIndex-1).addClass('active')
        topCache[oldIndex-1]=$(window).scrollTop();
        document.body.scrollTop = topCache[curIndex-1];
        if(curIndex==2){
            $('.btn-wrapper-for-filter').removeClass('hidden')
        }else{
            $('.btn-wrapper-for-filter').addClass('hidden')
        }
        //history.replaceState({},'','index.html')
    }

    function move(curIndex){
        var moveIndex =curIndex-1;
        // use translateZ(0) activate 3d hardware acceleration is possible
        tabCtn[0].style[transform]='translateX(-'+moveIndex*widthOfPanel+'%) translateZ(0)';
        var oldIndex = underline.attr('data-active-index')
        underline.css({left:moveIndex*100/numOfPanels+'%'}).attr('data-active-index',curIndex);
        afterMove(oldIndex,curIndex)
    }
    //bug-hack:一些浏览器中，第一个transition:transfrom 时，会留下残影，因此主动触发一次（但是没有动画效果）
    var hash = location.hash;
    var match = /tabindex=([1-3])/.exec(hash);
    if(match){
        move(+match[1]);
    }else{
        move(1);
    }
    navItems.on(tap_event,function(){
        var index = +$(this).attr('data-nav-index');
        var curIndex = underline.attr('data-active-index');
        if(curIndex == index)return;
        move(index);
    })
    /*tabCtn.on('swipeLeft',function(){
        var index = +underline.attr('data-active-index');
        if(index==numOfPanels) return;
        move(index+1);
    }).on('swipeRight',function(){
        var index = +underline.attr('data-active-index');
        if(index==1) return;
        move(index-1);
    })*/
    var isAndroid = false;
	if (navigator.userAgent.match(/Android/i)){
		isAndroid =true;
	}
	var touch={};
	tabCtn[0].addEventListener('touchstart',function(e){
		if(!e.touches|| e.touches.length===0)return;
		touch.x1 = e.touches[0].pageX;
		touch.y1 = e.touches[0].pageY;
	})
	tabCtn[0].addEventListener('touchmove',function(e){
		touch.x2 = e.touches[0].pageX;
		touch.y2 = e.touches[0].pageY;
		var absX = Math.abs(touch.x1-touch.x2),
			absY = Math.abs(touch.y1-touch.y2);
		if(isAndroid && absX>10 && absX>absY){
			e.preventDefault();
		}
        if(absX<absX) return;
		if(touch.x1-touch.x2>30){
			var index = +underline.attr('data-active-index');
			if(index==numOfPanels) return;
			move(index+1);
		}
		if(touch.x1-touch.x2<-30){
			var index = +underline.attr('data-active-index');
			if(index==1) return;
			move(index-1);
		}
	})
//	tabCtn[0].addEventListener('touchend',function(e){
//		var deltaX = touch.x1-touch.x2,
//			deltaY = touch.y1-touch.y2;
//		if(Math.abs(deltaX)<Math.abs(deltaY)) return;
//		if(deltaX>30){
//			var index = +underline.attr('data-active-index');
//			if(index==numOfPanels) return;
//			move(index+1);
//		}
//		if(deltaX<-30){
//			var index = +underline.attr('data-active-index');
//			if(index==1) return;
//			move(index-1);
//		}
//	})
}()

//点击右上角，相应的抽屉动画
!function(){
    var otherTopic = $('.other-topic');
    var topicItems = $('.topic-item',otherTopic);
    var wrapBg = $('.wrapTransBg');
    wrapBg.on(tap_event,function(){
        var time =0,timeSpan =150;
        var height = 181,hGap = 31;
        for(var i = topicItems.length-1;i>-1;i--){
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
        },750)
    })

    $('.for-other-topic').on(tap_event,function(){
        wrapBg.removeClass('hidden');
        var time =0,timeSpan =150;
        var height = 26,hGap = 31;
        topicItems.each(function(index,item){
            setTimeout(function(){
                otherTopic.css({height:height});
                height+=hGap;
                $(item).addClass("show");
            },time)
            time+=timeSpan
        })
    })
}()
//筛选相关
!function(){
    //用于本模块中公用变量的传递
    var filterGlobal = {};
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
                url: contextPath + '/pages/mobile/listAction/queryCars.json?index=999999&tracktype=0',
                data: dataObj,
                dataType: 'json',
                success: function(data){
                    if(data&&data.i){
                        cb(null,data.i)
                    }else{
                        cb('数据格式错误',0);
                    }

                }
            })
        }
    }

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
    !function brandSeries(){
        function makeBrands(brands) {
            var b, otherBrandsStr = '';
            var brandList = $('#brand-list');

            var $otherCtn = brandList.find('#other-brands');
            for (var i = 0; i < brands.length; i++) {
                b = brands[i];
                if (!hotBrands_g[b.code]) {
                    otherBrandsStr += '<div data-code="' + b.code + '" class="item col-1-4"><span class="brand-name">' + b.enName + '</span></div>';
                }
            }
            $otherCtn.append(otherBrandsStr);
        }
        function makeSeries(data){
            var codes = data['codes'];
            var html = '';
            for (var i in codes) {
                //html += '<div class="clearfix" >';
                html += '<div class="series-title">' + i + '</div ><div class="series-name-wrapper">'
                var s = codes[i];
                for (var j in s) {
                    var b = s[j];
                    html += '<div class="series-item" data-code="' + b.code + '"><span class="series-name">' + b.name + '</span></div>';
                }
                html += '</div>';
            }
            $('.series-content').append(html);
        }
        $('#J_brand').on(tap_event,function(){
            //显示品牌弹出框
            $('.wrapGrayBg').removeClass('hidden');
            $('#brand-list').css({
                top: $(window).scrollTop() + 50
            }).removeClass('hidden');

            var self = $(this);
            if(self.attr('hasLoaded'))return;
            //add hot brands first
            var hotBrandsStr = '';
            var $hotCtn = $('#brand-list #hot-brands');
            for (var i in hotBrands_g) {
                hotBrandsStr += '<div data-code = "' + i + '"class = "item col-1-4"><span class="brand-name">' + hotBrands_g[i] + ' </span></div>';
            }
            $hotCtn.append(hotBrandsStr);
            utils.getAllBrand(function(data){
                self.attr('hasLoaded',true);
                makeBrands(data.items);
            })
        })
        filterGlobal.selectBrand = ''
        filterGlobal.selectSeries = ''
        $('#J_series').on(tap_event,function(){
            $('.wrapGrayBg').removeClass('hidden');
            $('#series-list').css({
                top: $(window).scrollTop() + 50
            }).removeClass('hidden');
        })
        $('.wrapGrayBg').on(tap_event,function(){
            $('.filter-popup-wrapper').addClass('hidden');
            $('.wrapGrayBg').addClass('hidden');
        })
        $('#brand-list').on(tap_event,'.item',function(){
            var self = $(this)
            //清空车系的状态
            $('.series-content').empty();
            $('#J_series').text('选择车系');
            $('.selected-brand-name').text('请先选择品牌');
            if(self.hasClass('selected')){
                self.removeClass('selected');
                $('#J_brand').text('选择品牌');
            }else{
                $('#brand-list .item').removeClass('selected');
                self.addClass('selected');
                $('.filter-popup-wrapper').addClass('hidden');
                $('.wrapGrayBg').addClass('hidden');
                var bName = self.find('.brand-name').text()
                var bCode = self.attr('data-code');
                $('#J_brand').text(bName);
                $('.selected-brand-name').text(bName);
                filterGlobal.selectBrand = bCode;

                filterGlobal.queryCount();

                utils.getSeriesByBrand(bCode,makeSeries);
            }
        })
        $('#series-list').on(tap_event,'.series-item',function(){
            var self = $(this);
            if(self.hasClass('selected')){
                self.removeClass('selected');
                $('#J_series').text('选择车系');
            }else{
                $('#series-list .series-item').removeClass('selected');
                self.addClass('selected');
                $('.filter-popup-wrapper').addClass('hidden');
                $('.wrapGrayBg').addClass('hidden');
                var sName = self.find('.series-name').text()
                var sCode = self.attr('data-code');
                filterGlobal.selectSeries = sCode;
                filterGlobal.queryCount();
                $('#J_series').text(sName);
            }
        })
        //重置和数量显示
        !function() {
            $('#J_btnFilter_reset').on(tap_event, function () {
                filterGlobal.selectBrand = '';
                filterGlobal.selectSeries = '';
                $('.series-content').empty();
                $('#brand-list .item').removeClass('selected');
                $('#J_brand').text('选择品牌')
                $('#J_series').text('选择车系')
                $('.selected-brand-name').text('请先选择品牌');
                filterGlobal.initPriceOption();
                $('#J_advancedFilterItems select>option:first-child').prop('selected', true)
            })
            $('.select-cond').change(function(){
                filterGlobal.queryCount();
            })

        }();

    }()

    function buildQueryObj(){
        function getCond(val){
            return (!!val)?val:'';
        }
        var dataObj = {};
        dataObj.carBrand = filterGlobal.selectBrand;
        dataObj.carSeries = filterGlobal.selectSeries;
        dataObj.carYear = $('#J_year').val()+'-9999';
        dataObj.carPrice = $('#J_minPrice').val()+'-'+$('#J_maxPrice').val();
        dataObj.carMileage = getCond($('#J_mile').val());
        dataObj.carModel = getCond($('#J_model').val());
        dataObj.carEngineVolume = getCond($('#J_volume').val());
        dataObj.transmissionType = getCond($('#J_transmission').val());
        return dataObj;
    }
    function queryCount(){
        var dObj = buildQueryObj();
        utils.queryCarsCount(dObj,function(err,count){
            $('#J_btnFilter_submit').text('为您找到'+count+'辆车')
        })
    }
    filterGlobal.queryCount = queryCount;
    $('#J_btnAdvance').on('click',function(){
        $('#J_advanceWrapper').addClass('hidden');
        $('#J_advancedFilterItems').removeClass('hidden')
    })
}();
