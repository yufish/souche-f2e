define('index/car-god',[],function() {
    var carGod = {
        init: function() {
            var ITEM_DETAIL_HEIGHT = 150;
            var lastExpanItem = $("#qa .cheshen-box .cheshen-detail:eq(0)");
            var lastExpanIndex = 0;
            //为每个item编号
            $("#qa .cheshen-box .cheshen-detail").each(function(i, detail) {
                $(detail).attr("data-index", i);
            })
            $("#qa .cheshen-box .cheshen-detail").css({
                height: 0
            })
            $("#qa .cheshen-box .cheshen-detail:eq(0)").css({
                height: ITEM_DETAIL_HEIGHT
            });
            var isAnim = false;
            $("#qa .cheshen-box").on("mouseover", function() {
                var nowDetail = $(this).find(".cheshen-detail");
                var nowIndex = nowDetail.attr("data-index");
                //如果正在动，直接忽略事件
                //如果展开和浮上的一样，直接忽略事件
                if (!isAnim && lastExpanIndex != nowIndex) {
                    lastExpanItem.animate({
                        height: 0
                    }, 400);
                    isAnim = true;
                    setTimeout(function() {
                        isAnim = false;
                    }, 500);
                    $(this).find(".cheshen-detail").animate({
                        height: ITEM_DETAIL_HEIGHT
                    }, 400)
                    $("#qa .show").removeClass("close")
                    $(this).find(".show").addClass("close")
                    lastExpanItem = nowDetail;
                    lastExpanIndex = nowIndex;
                }

            })
        }
    }
    return carGod;
});
define('index/top-nav',[],function() {
    var topNav = {
        init: function() {
            $(".nav-item").each(function(i, item) {
                var inner = $(item).find(".nav-inner");
                //预先计算每个inner的高度，留着动画用
                //先透明，然后显示出来，计算高度，然后隐藏
                $(inner).css({
                    opacity: 0
                }).removeClass("hidden");
                $(inner).attr("data-height", $(inner).height())
                    .addClass("hidden");
                var itemWidth = $(item).width();
                var itemHeight = $(item).height();
                var innerWidth = inner.width();
                $(item).attr("data-width", itemWidth);
                $(item).attr("data-height", itemHeight);
                $(item).attr("data-innerWidth", innerWidth);
            });
            var isIns = {

            }
            var zIndexBegin = 10001;
            $(".nav-item").mouseenter(function(event) {
                var name = $(this).attr("data-name");
                isIns[name] = true;
                var self = this;
                setTimeout(function() {
                    if (!isIns[name]) return;
                    var itemWidth = $(self).attr("data-width");
                    var itemHeight = $(self).attr("data-height");
                    var inner = $(self).find(".nav-inner");
                    inner.removeClass("hidden");
                    $(self).css("zIndex", ++zIndexBegin)
                    var innerHeight = inner.attr("data-height");
                    inner.attr("data-height", innerHeight);
                    //先显示inner，算出其宽高，然后变小，再动画变大。
                    inner.css({
                        width: itemWidth,
                        height: itemHeight,
                        opacity: 1
                    }).animate({
                        width: $(self).attr("data-innerWidth"),
                        height: innerHeight,
                        opacity: 1
                    }, 400)
                }, 200)

            }).mouseleave(function() {
                var name = $(this).attr("data-name");
                isIns[name] = false;
                var self = this;
                var itemWidth = $(self).attr("data-width");
                var itemHeight = $(self).attr("data-height");
                var inner = $(self).find(".nav-inner");
                var innerHeight = inner.attr("data-height");
                inner.animate({
                    width: itemWidth,
                    height: itemHeight,
                    opacity: 1
                }, 300, function() {
                    //动画后恢复inner的高度
                    inner.css({
                        height: innerHeight
                    }).addClass("hidden")
                })
            })
            $(document.body).on("touchstart", function() {
                $(".nav-inner").addClass("hidden")
            })
        }
    }
    return topNav;
});
/**
 * 一个本地存储的类，带有错误处理，在ie不会抛错，只会存储失败
 *
 * @return {[type]} [description]
 */
define('souche/util/sc-db',[],function() {

    var SCDB = function(_namespace) {
            this.namespace = (_namespace || 'souche') + "_";
        }
        // if (typeof(localStorage) == "undefined") {
        //     alert(typeof(localStorage))
        //     var localStorage = {
        //         getItem: function() {
        //             return "";
        //         },
        //         setItem: function() {

    //         }
    //     }
    // }
    var util = {
        /**
         * 将任何值转换为数组，如果已经是直接返回。
         */
        valueToArray: function(value) {
            if (value == null) {
                return [];
            } else if (value.splice && value.length) {
                return value;
            } else {
                return [value];
            }
        }
    }
    SCDB.prototype = {
        /**
         * [get description]
         * @param  {[type]} key  [description]
         * @param  {[type]} time [缓存时间，超过此时间，返回空]
         * @return {[type]}      [description]
         */
        get: function(key, time) {
            key = this.namespace + key;
            var value = localStorage.getItem(key);
            var _data = JSON.parse(value);
            value = _data.data;
            var lastTime = _data.time;
            if (time && ((new Date()).getTime() - lastTime > time)) {
                return null;
            }
            if (!value.length) {
                value = null;
                return value;
            }
            return value[0];
        },
        set: function(key, value) {
            key = this.namespace + key;
            value = util.valueToArray(value);
            try {
                localStorage.setItem(key, JSON.stringify({
                    time: new Date().getTime(),
                    data: value
                }));
            } catch (e) {

            }

        },
        gets: function(key, time) {
            key = this.namespace + key;
            var value = localStorage.getItem(key);
            var _data = JSON.parse(value);

            value = _data.data;
            var lastTime = _data.time;
            if (time && ((new Date()).getTime() - lastTime > time)) {
                return null;
            }
            return value;
        },
        sets: function(key, value) {
            key = this.namespace + key;
            value = util.valueToArray(value);
            try {
                localStorage.setItem(key, JSON.stringify({
                    time: new Date().getTime(),
                    data: value
                }));
            } catch (e) {

            }
        },
        add: function(key, value) {
            var values = this.gets(key);
            var value = util.valueToArray(value);
            if (values) {
                values = values.concat(value);
            } else if (value) {
                values = value;
            }
            this.sets(key, values);
        },
        del: function(key) {
            key = this.namespace + key;
            localStorage.setItem(key, '');
        }
    }
    return SCDB;
});
/**
 * 带有缓存的品牌和车系等得请求方法
 * @param  {[type]} DB [description]
 * @return {[type]}    [description]
 */
define('souche/util/load-info',['souche/util/sc-db'], function(DB) {
    var BRAND_KEY = "BRAND_CACHE_KEY";
    var SERIES_KEY = "SERIES_CACHE_KEY";
    var PROVINCE_KEY = "PROVINCE_CACHE_KEY"
    var CITY_KEY = "CITY_CACHE_KEY"
    var db = new DB("LOADINFO")
    return {
        loadBrands: function(callback) {
            var data = null;
//            try {
//                data = db.get(BRAND_KEY);
//            } catch (e) {
//
//            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevel.json",
                    dataType: "json",
                    data: {
                        type: "car-subdivision"
                    },
                    success: function(data) {
//                        db.set(BRAND_KEY, data);
                        callback(data);

                    },
                    error: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    }
                });
//            }

        },
        loadSeries: function(brandid, callback) {
            var data = null;
//            try {
//                data = db.get(SERIES_KEY + brandid);
//            } catch (e) {
//
//            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                    dataType: "json",
                    data: {
                        type: "car-subdivision",
                        code: brandid
                    },
                    success: function(data) {
//                        db.set(SERIES_KEY + brandid, data);
                        callback(data)
                    },
                    error: function() {
                        // alert("车系信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("车系信息请求出错，刷新后再试")
                    }
                });
//            }
        },
        loadProvince: function(callback) {
            var data = null;
            try {
                data = db.get(PROVINCE_KEY);
            } catch (e) {

            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevel.json?type=area",
                    dataType: "json",
                    data: {
                        type: "area"
                    },
                    success: function(data) {
                        db.set(PROVINCE_KEY, data);
                        callback(data);

                    },
                    error: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    }
                });
//            }
        },
        loadCity: function(provinceCode, callback) {
            var data = null;
            try {
                data = db.get(CITY_KEY);
            } catch (e) {

            }
//            if (data) {
//                callback(data);
//            } else {
                $.ajax({
                    url: contextPath + "/pages/dicAction/loadRootLevel.json?request_message={\"code\":\"" + provinceCode + "\",\"type\":\"area\"}",
                    dataType: "json",
                    data: {

                    },
                    success: function(data) {
                        db.set(CITY_KEY, data);
                        callback(data);

                    },
                    error: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    },
                    failure: function() {
                        // alert("品牌信息请求出错，刷新后再试")
                    }
                });
//            }
        }
    }
});
define('index/mod/rss-addSeries',['souche/util/load-info'],function(LoadInfo){
    var groupBy = function(array, predicate, context) {
        var result = {};

        for (var index = 0, len = array.length; index < len; index++) {
            var key = predicate.call(context || window, array[index]);
            if (result[key]) {
                result[key].push(array[index]);
            } else {
                result[key] = [array[index]];
            }
        }
        return result;
    }
    var config = {
    };
    var tempSelected = [];
    var inited = false;
    return {
        selectedSeries:[],
        selectedBrands:[],
        init:function(_config){
            var self = this;
            $.extend(config,_config);
            if(config.userRequementJson['series']){
                this.selectedSeries = config.userRequementJson['series']
            }
            if(config.userRequementJson['brands']){
                this.selectedBrands = config.userRequementJson['brands']
            }

        },
        show:function(){
            if(!inited){
                this._createAtoZ();
                this._createBrands();
                this._bind();

            }
            tempSelected = []
            for(var i=0;i<this.selectedSeries.length;i++){
                tempSelected.push(this.selectedSeries[i])
            }
            $(".brandList li").eq(0).find("a").click();
            $(".addInstrestCar").removeClass("hidden").css({
                opacity:0
            }).animate({
                opacity:1
            },200)
            this._renderSelected()
        },
        delSeries:function(code){
            if(code.indexOf("brand")!=-1){
                for(var i=0;i<this.selectedBrands.length;i++){
                    var brand = this.selectedBrands[i].split(",");
                    var _code = brand[0];
                    if(_code==code){
                        this.selectedBrands.splice(i,1);
                        break;
                    }
                }
            }else{
                for(var i=0;i<this.selectedSeries.length;i++){
                    var series = this.selectedSeries[i].split(",");
                    var _code = series[0];
                    if(_code==code){
                        this.selectedSeries.splice(i,1);
                        break;
                    }
                }
                $(".chexiContent .series-item").each(function(i,item){
                    if($(item).attr("code")==code){
                        $(item).removeClass("active")
                    }
                })
            }

            $(this).trigger("change",{selectedSeries:this.selectedSeries,selectedBrands:this.selectedBrands})
            this._renderSelected();
        },
        _bind:function(){
            var self = this;
            $("#J_addSeries_submit").on("click",function(){
                $(".addInstrestCar").animate({
                    opacity:0
                },200,function(){
                    $(".addInstrestCar").addClass("hidden")
                })
                $(self).trigger("submit",{selectedSeries:self.selectedSeries})
            })
            $("#J_addSeries_cancel").on("click",function(){
                $(".addInstrestCar").animate({
                    opacity:0
                },200,function(){
                    $(".addInstrestCar").addClass("hidden")
                })
                self.selectedSeries = []
                for(var i=0;i<tempSelected.length;i++){
                    self.selectedSeries.push(tempSelected[i])
                }
                self._renderSelected();
                $(self).trigger("change",{selectedSeries:self.selectedSeries,selectedBrands:self.selectedBrands})
                $(self).trigger("cancel")
            })
            $("#J_selected_series").on("click",".selected-item",function(){
                self.delSeries($(this).attr("code"))
            })
        },
        _createAtoZ:function() {
            var zimu = 'ABCDFGHJKLMNOQRSTWXYZ'
            var html = "";
            for (var i = 0; i < zimu.length; i++) {
                html += "<a data-id='" + zimu[i] + "'>" + zimu[i] + "</a>";
            }
            $(".brandNav").html(html);
        },
        //创建品牌列表
        _createBrands:function(){
            var self = this;
            LoadInfo.loadBrands(function(result){
                var brand = groupBy(result.items, function(value) {
                    return value.name.split(" ")[0];
                });
                var templateHTML = "";

                for (var key in brand) {
                    if (brand.hasOwnProperty(key)) {
                        templateHTML += "<li><span data-id='" + key + "'>" + key + "<\/span>"; //<a>哈弗H6<\/a><a>哈弗H6<\/a><a>哈弗H6<\/a>
                        for (var key1 in brand[key]) {
                            if (brand[key].hasOwnProperty(key1)) {

                                templateHTML += "<a code='" + brand[key][key1].code + "'><img src='http://res.souche.com/files/carproduct/brand/"+brand[key][key1].code+".png'/>" + brand[key][key1].enName + "<\/a>";
                            }
                        }
                        templateHTML += "<\/li>";
                    }
                }
                $(".addInstrestCarContent .brandList ul").html(templateHTML);
                $(".addInstrestCarContent .brandList ul a").on("click",function(){
                    $(".addInstrestCarContent .brandList ul a").removeClass("active")
                    $(this).addClass("active")
                    self._loadSeries($(this).attr("code"))
                })
                $(".brandNav a").live("click", function() {
                    var id = $(this).attr("data-id");
                    if (!$(".brandList span[data-id='" + id + "']").offset())
                        return false;
                    var top = $(".brandList span[data-id='" + id + "']").offset().top - $(".brandList span").eq(0).offset().top;

                    $(".brandList").animate({scrollTop:top});
                    return false;
                });
                $(".brandList li").eq(0).find("a").click();
            })
        },
        _loadSeries:function(brandCode){
            var self = this;
            LoadInfo.loadSeries(brandCode,function(result){
                // $(".chexi .chexiTitle").html("<h1>全部车系</h1><span data-name=" + name + ">全部</span>");
//                $(".chexi .chexiTitle span").attr("code", code);
//                if (selectedresult.items) {
//                    $(".chexi .chexiTitle span").addClass("active");
//                } else {
//                    $(".chexi .chexiTitle span").removeClass("active");
//                }

                var templateHTML = "";
                for (var key in result.codes) {
                        templateHTML += "<li class=clearfix>";
                        templateHTML += "<h1>" + key + "<\/h1>";
                        for (var i=0;i<result.codes[key].length;i++){
                            var item = result.codes[key][i];
                            if (!self._isInSelected(item.code))
                                templateHTML += "<div class='series-item' code='" + item.code + "'><i></i><img src='http://res.souche.com/files/carproduct/series/"+item.code+".png'/>" + item.name + "<\/div>";
                            else {
                                templateHTML += "<div class='series-item active' code='" + item.code + "' ><i></i><img src='http://res.souche.com/files/carproduct/series/"+item.code+".png'/>" +item.name + "<\/div>";
                            }
                        }
                }
                $(".chexi .chexiContent ul").html(templateHTML);
                $(".chexi .chexiContent .series-item").on("click",function(){
                    if($(this).hasClass("active")){
                        $(this).removeClass("active");
                        self.delSeries($(this).attr("code"))
                        $(self).trigger("change",{selectedSeries:self.selectedSeries,selectedBrands:self.selectedBrands})
                        self._renderSelected();
                    }else{
                        $(this).addClass("active");
                        self._addSelected($(this).attr("code"),$(this).text())
                        $(self).trigger("change",{selectedSeries:self.selectedSeries,selectedBrands:self.selectedBrands})
                        self._renderSelected();
                    }

                })
            })
        },
        //某个code是否存在于selected中
        _isInSelected:function(code){
            var isIn = false;

            for(var i=0;i<this.selectedSeries.length;i++){
                var series = this.selectedSeries[i].split(",");
                var _code = series[0];
                if(_code==code){
                    isIn = true;
                }
            }
            return isIn;
        },
        _addSelected:function(code,name){
            if(!this._isInSelected(code)){
                this.selectedSeries.push(code+","+name)
            }

        },
        _renderSelected:function(){
            var html = "";
            for(var i=0;i<this.selectedSeries.length;i++) {
                var series = this.selectedSeries[i].split(",");
                var _code = series[0];
                var _name = series[1];
                html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/series/"+_code+".png'/>"+_name+"</div>"
            }
            for(var i=0;i<this.selectedBrands.length;i++) {
                var series = this.selectedBrands[i].split(",");
                var _code = series[0];
                var _name = series[1];
                html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/brand/"+_code+".png'/>"+_name+"</div>"
            }
            $(".selected-series").html(html);

        }

    };
});
/**
 * 让dom的文字里的数字变化动起来。
 *
 * NumAnimate.animateInnerHTML($(".num"),"2万");
 */
define('souche/util/num-animate',[],function(){
    return {
        animateInnerHTML:function($ele,to){
            var from = $ele.html();
            var num_from = from.replace(/[^-0-9]/g,"");
            var num_to = to.replace(/[^-0-9]/g,"");
            if(num_from!==""&&num_to!==""){
                num_from = num_from*1;
                num_to = num_to*1;
                if(num_from-num_to>50||num_from-num_to<-50){
                    $ele.html(to)
                }else if(num_from<num_to){
                    setTimeout(function(){
                        if(num_from<num_to){
                            num_from++;
                            $ele.html(from.replace(/[-0-9]+/g,num_from))
                            setTimeout(arguments.callee, 10)
                        }
                    },10)
                }else{
                    setTimeout(function(){
                        if(num_from>num_to){
                            num_from--;
                            $ele.html(from.replace(/[-0-9]+/g,num_from))
                            setTimeout(arguments.callee, 10)
                        }
                    },10)
                }

            }else{
                $ele.html(to)
            }

        },
        animateValue:function($ele,to){

        }
    }
});
/**
 * [CustomSelect 自定义下拉框，可以多选，可定义下拉样式]
 */
define('souche/custom-select',['souche/util/num-animate'],function(NumAnimate) {
Souche.UI.CustomSelect = function() {
    var select = function(id, _config) {
        this.id = id;
        this.ele = typeof(id) != "string" ? $(id) : $("#" + this.id);
        this.config = {
            isAutoDrop: true,
            placeholder: "请选择品牌",
            multi: true,
            listContainer: ".sc-select-list .sc-popup-bd"
        };
        $.extend(this.config, _config)
        this.selected = [];
        if (this.config.onchange) {
            $(this).on("change", this.config.onchange);
        }
        this._init();
        this._defaultHeadHeight = 30;
        this._enable = true;
    };
    /**
     * 自定义事件：select unselect
     */
    $.extend(select.prototype, {
        //添加下拉里的html，并且激活相应的option
        addOptions: function(html) {
            $(this.config.listContainer, this.ele).append(html)
            for (var i = 0; i < this.selected.length; i++) {
                $(".sc-select-list .option[data-value='" + this.selected[i].key + "']").addClass("active");
            }
        },
        setSelected:function(key){
            if (!this.config.multi) {
                this.selected=[{
                    key: key,
                    value:key
                }]

            }else{
                this.selected.push({
                    key: key,
                    value: key
                })
            }
            $(self).trigger("change", {
                key: key,
                value: key
            })
            this._renderSelected();
        },
        removeSelected: function(key) {
            this._delKey(key);
            this._renderSelected();
        },
        removeAllOption: function() {
            $(this.config.listContainer, this.ele).html("");
        },
        showOptions: function() {
            if (!this._enable) return;
            $(".sc-select-list", this.ele).removeClass("hidden");
            this.ele.addClass("sc-active");
            $(this).trigger("show");
        },
        hideOptions: function() {
            $(".sc-select-list", this.ele).addClass("hidden");
            this.ele.removeClass("sc-active");
            $(this).trigger("hide");
        },
        disable: function(txt) {
            $(".sc-select-content", this.ele).html("<span class='placeholder'>" + txt + "</span>");
            this._enable = false;
        },
        enable: function(txt) {
            this._enable = true;
            this._renderSelected();
        }
    })
    $.extend(select.prototype, {
        _init: function(_config) {
            var self = this;
            Souche.Util.mixin(this.config, _config);

            this._defaultHeadHeight = $(".sc-select-hd").height();
            $(".sc-selected-item", self.ele).each(function(i, v) {
                self.selected.push({
                    key: $(v).attr("data-value"),
                    value: $(v).text().replace("x", "")
                })
            })
            if (!this.config.multi) {
                if ($(".selected_values", self.ele).val()) {
                    self.selected = [{
                        key: $(".selected_values", self.ele).val(),
                        value: $(".selected_values", self.ele).val()
                    }]
                }
            }
            $(document.body).on("click", function(e) {

                if (!$(e.target).closest(".sc-select").length) {
                    self.hideOptions();
                }

            });
            this._bindClick();
            this._bindSelect();
            if (this.config.multi) {
                this._renderSelected();
            } else {
                this._renderSingleSelected();
            }

        },
        //绑定输入框的点击事件
        _bindClick: function() {
            var self = this;
            var mouseOverStatus = 0;

            function checkShow() {
                var list = $(".sc-select-list", self.ele);
                if (mouseOverStatus) {
                    $(".sc-select-list").addClass("hidden");
                    self.showOptions();
                    $(".sc-select-list", self.ele).css({
                        top: $(".sc-select-hd", self.ele).height() + 2
                    });
                    if (self.config.isAutoDrop) {
                        self._autoDrop(list);
                    }
                    $(".sc-select-list", self.ele).scrollTop(0)
                    $(list[0].parentNode).css({
                        zIndex: Souche.Data.DropdownzIndex++
                    });
                } else {
                    self.hideOptions();
                    list.css({
                        top: 30
                    });
                }
            }
            $(".sc-select-hd", this.ele).click(function(e) {
                var list = $(".sc-select-list", self.ele);
                if ($(".sc-select-list", self.ele).hasClass("hidden")) {
                    $(".sc-select-list").addClass("hidden");
                    self.showOptions();
                    $(".sc-select-list", self.ele).css({
                        top: $(".sc-select-hd", self.ele).height() + 2
                    });
                    if (self.config.isAutoDrop) {
                        self._autoDrop(list);
                    }
                    $(".sc-select-list", self.ele).scrollTop(0)
                    $(list[0].parentNode).css({
                        zIndex: Souche.Data.DropdownzIndex++
                    });
                } else {
                    self.hideOptions();
                    list.css({
                        top: 30
                    });
                }

            })
            var openTimer, closeTimer;
            $(this.ele).mouseenter(function() {
                mouseOverStatus = 1;
                clearTimeout(openTimer);
                clearTimeout(closeTimer);
                openTimer = setTimeout(function() {
                    checkShow();
                }, 1000);

            }).mouseleave(function() {
                mouseOverStatus = 0;
                clearTimeout(closeTimer);
                clearTimeout(openTimer);
                closeTimer = setTimeout(function() {
                    checkShow();
                }, 500);
            })



        },
        //绑定选择事件
        _bindSelect: function() {
            var self = this;
            $(".sc-select-list", self.ele).on("click", "a.option", function(e) {
                e.preventDefault();
                var key = $(this).attr("data-value");
                var value = $(".value", this).html();
                var $this = $(this);

                if (self.config.multi) {
                    if ($this.hasClass("active")) {
                        self._delKey(key);
                        $this.removeClass("active");
                        $(self).trigger("unselect", {
                            key: key,
                            value: value
                        })
                    } else {
                        self._addKey(key, value);
                        $this.addClass("active");
                        $(self).trigger("select", {
                            key: key,
                            value: value
                        })
                    }
                    self._renderSelected();
                } else {
                    self.selected = [{
                        key: key,
                        value: value
                    }];
                    self._renderSingleSelected();
                }
                $(self).trigger("change", {
                    key: key,
                    value: value
                })
                // $(".sc-select-content",self.ele).html(value)
                // $(".selected_value",self.ele).val(key)
                e.stopPropagation();
            })
            $(".sc-select-list", self.ele).on("click", function(e) {
                e.stopPropagation();
            });
            $(".close", self.ele).on("click", function(e) {
                self.hideOptions();
            })
            $(".sc-select-list", self.ele).on("scroll", function(e) {
                e.stopPropagation();
            })
        },
        _delKey: function(key) {
            var self = this;
            for (var i = 0; i < self.selected.length; i++) {
                var s = self.selected[i];
                if (s && s.key == key) {
                    self.selected.splice(i, 1)
                }
            }
        },
        _addKey: function(key, value) {
            var self = this;
            var alreadySelected = false;
            for (var i = 0; i < self.selected.length; i++) {
                var s = self.selected[i];
                if (s && s.key == key) {
                    alreadySelected = true;
                }
            }
            if (!alreadySelected) {
                self.selected.push({
                    key: key,
                    value: value
                })
            } else {

            }
        },
        //渲染选择框里的item
        _renderSelected: function() {
            var self = this;
            var s = []
            for (var i = 0; i < self.selected.length; i++) {
                s.push(self.selected[i].key)
            }
            $(".selected_values", self.ele).val(s.join(","))
            $(".sc-select-content", self.ele).html("")
            for (var i = 0; i < self.selected.length; i++) {
                var s = self.selected[i];
                $(".sc-select-content", self.ele).append("<div class=sc-selected-item data-value='" + s.key + "'>" + s.value + "<i class=sc-close>x</i></div>")

            }
            $(".sc-selected-item", self.ele).on("click", function(e) {
                var key = $(this).attr("data-value");
                for (var i = 0; i < self.selected.length; i++) {
                    var s = self.selected[i];
                    if (s && s.key == key) {
                        self.selected.splice(i, 1)
                    }
                }
                $(self).trigger("unselect", {
                    key: key
                })
                self._renderSelected();
                // self.hideOptions();
                $(".sc-select-list a.option[data-value='" + key + "']", self.ele).removeClass("active")

                e.stopPropagation();
            })
            if (self.selected.length) {} else {
                $(".sc-select-content", self.ele).html("<span class='placeholder'>" + self.config.placeholder + "</span>")
            }

            $(".sc-select-list", self.ele).css({
                top: $(".sc-select-hd", self.ele).height() + 2
            });

        },
        _renderSingleSelected: function() {
            var self = this;
            var s = []
            for (var i = 0; i < self.selected.length; i++) {
                s.push(self.selected[i].key)
            }

            $(".selected_values", self.ele).val(s.join(","))
            if (this.selected.length) {
                if(this.config.format)
                {
                    this.selected[0].value = this.config.format(this.selected[0].value);
                }
//                $(".sc-select-content", this.ele).html(this.selected[0].value);
                NumAnimate.animateInnerHTML($(".sc-select-content", this.ele),this.selected[0].value)
            } else {
                $(".sc-select-content", this.ele).html("<span class='placeholder'>" + this.config.placeholder + "</span>")
            }
            if (this.selected && this.selected.length) {
                $(self).trigger("change", {
                    key: this.selected[0].key,
                    value: this.selected[0].value
                })
            }

            this.hideOptions();
        },
        _autoDrop: function(list) {
            var c = this.config
            //自适应滚屏,求实现，如果select被覆盖，自动缩短其高度
            // if(list.offset().top+list.height()>$(window).scrollTop()+$(window).height()){
            //   list.css({
            //     height:c.optionHeight-list.offset().top-list.height()+23
            //   });

            // }else{
            //   list.css({
            //     top:25
            //   });
            // }
        }
    })

    return select;
}();


    return Souche.UI.CustomSelect;
});
define('index/qiugou',['index/mod/rss-addSeries','souche/custom-select'],
function(AddSeries,CustomSelect){
    var data = {
        brands:[],
        series:[],
        startYear:null,
        endYear:null,
        minPrice:null,
        maxPrice:null
    }
    var ageSelect,ageSelectHigh;
    var priceSelect,priceSelectHigh;
    var config = {};
    return {
        init:function(_config){
            $.extend(config,_config);
            AddSeries.init(_config);
            this._initData(_config.userRequementJson);
            this._bind();
            if(_config.userRequementJson.series){
                this._renderSelected(_config.userRequementJson.series,_config.userRequementJson.brands)
            }
            this._initSelect();
        },
        _initSelect:function(){
            ageSelect = new CustomSelect("age_select", {
                placeholder: "请选择",
                multi: false
            });
            $(ageSelect).on("change",function(e,_data){
                data.startYear = _data.value;
            })
            ageSelectHigh = new CustomSelect("age_select_high", {
                placeholder: "请选择",
                multi: false
            });
            $(ageSelectHigh).on("change",function(e,_data){
                data.endYear = _data.value;
            })

            priceSelect = new CustomSelect("price_select", {
                placeholder: "请选择",
                multi: false
            });
            $(priceSelect).on("change",function(e,_data){
                if(_data.key==-1){
                    $(".select_dataContainer").addClass("hidden");
                    $(".input_dataContainer").removeClass("hidden")
                    return;
                }
                _data.value = _data.value.replace(/[^0-9]/g,"")
                data.minPrice = _data.value;
                $(".low-price").val(data.minPrice);
            })
            priceSelectHigh = new CustomSelect("price_select_high", {
                placeholder: "请选择",
                multi: false
            });
            $(priceSelectHigh).on("change",function(e,_data){
                if(_data.key==-1){
                    $(".select_dataContainer").addClass("hidden");
                    $(".input_dataContainer").removeClass("hidden")
                    return;
                }
                _data.value = _data.value.replace(/[^0-9]/g,"")
                data.maxPrice = _data.value;
                $(".high-price").val(data.maxPrice);
            })
//            $(".low-price").on("keyup",function(){
//                $(this).val($(this).val().replace(/[^0-9]/, ""))
//            })
//            $(".low-price").on("keyup",function(){
//                $(this).val($(this).val().replace(/[^0-9]/, ""))
//            })
            setInterval(function() {
                $(".low-price").each(function(i, p) {
                    if(/[^0-9]/.test($(p).val())){

                    $(p).val($(p).val().replace(/[^0-9]/, ""))
                        }
                })
                $(".high-price").each(function(i, p) {
                    if(/[^0-9]/.test($(p).val())) {
                        $(p).val($(p).val().replace(/[^0-9]/, ""))
                    }
                })
            }, 200)
        },
        //根据配置的userRequementJson的生成初始数据
        _initData:function(initJson){
            if(initJson.brands&&initJson.brands.length){
                for(var i=0;i<initJson.brands.length;i++){
                    var series = initJson.brands[i].split(",");
                    var _code = series[0];
                    data.brands.push(_code);
                }
            }
            if(initJson.series&&initJson.series.length){
                for(var i=0;i<initJson.series.length;i++){
                    var series = initJson.series[i].split(",");
                    var _code = series[0];
                    data.series.push(_code);
                }
            }
            if(initJson.startYear) {
                data.startYear = initJson.startYear;
//                ageSelect.setSelected(data.startYear);
            }
            if(initJson.endYear) data.endYear = initJson.endYear;
            if(initJson.minPrice) data.startYear = initJson.minPrice;
            if(initJson.maxPrice) data.startYear = initJson.maxPrice;

        },
        _bind:function(){
            var self = this;
            //选择感兴趣的车系
            $(".addCarinstrestItem").on("click",function(){
                AddSeries.show();
            });
            //从series读取数据
            $(AddSeries).on("change",function(e,_data){
                data.series = [];
                for(var i=0;i<_data.selectedSeries.length;i++) {
                    var series = _data.selectedSeries[i].split(",");
                    var _code = series[0];
                    data.series.push(_code);
                }
                data.brands = [];
                for(var i=0;i<_data.selectedBrands.length;i++) {
                    var series = _data.selectedBrands[i].split(",");
                    var _code = series[0];
                    data.brands.push(_code);
                }
                self._renderSelected(_data.selectedSeries,_data.selectedBrands);
            })
            //删除的动作，
            $(".selected_series_result").on("click",".selected-item",function(){
                AddSeries.delSeries($(this).attr("code"))
            })

            var rss_isSubmiting = false;
            //提交订阅
            $("#J_xuqiu_submit").on("click",function(){

                if(rss_isSubmiting) return;

                data.minPrice = $(".low-price").val();
                data.maxPrice = $(".high-price").val();
                if(!(data.brands.length
                    ||data.series.length
                    ||data.endYear
                    ||data.startYear
                    ||data.minPrice
                    ||data.maxPrice)){
                    $(".trail .warning").html("请至少填写一项").removeClass("hidden")
                    return;
                }
                if(data.startYear&&data.endYear&&data.minYear>data.maxYear){
                    $(".trail .warning").html("年份选择错误").removeClass("hidden")
                    return;
                }
                if(data.minPrice&&data.maxPrice&&data.minYear>data.maxYear){
                    $(".trail .warning").html("预算填写错误").removeClass("hidden")
                    return;
                }
                rss_isSubmiting = true;
                $(this).addClass("loading").html("提交中")
                Souche.MiniLogin.checkLogin(function(){
                    $.ajax({
                        url:config.submit_api,
                        data:{
                            brands:data.brands.join(","),
                            series:data.series.join(","),
                            minYear:data.startYear,
                            maxYear:data.endYear,
                            minPrice:data.minPrice,
                            maxPrice:data.maxPrice
                        },
                        dataType:"json",
                        success:function(result){
                            window.location.href=(window.location.href.indexOf("fromRss=1")!=-1)?window.location.href:(window.location.href+"?fromRss=1")
                        },
                        error:function(){

                            rss_isSubmiting = false;
                        }
                    })
                },false,false,false)

            })
            //获取一个初始宽度
            if($(".dialogContentContainer").hasClass("hidden")){
                $(".dialogContentContainer").css({opacity:0}).removeClass("hidden")
                var dialogWidth = $(".dialogContentContainer").width();
                $(".dialogContentContainer").css({opacity:1}).addClass("hidden")
            }else{
                var dialogWidth = $(".dialogContentContainer").width();
            }

            //编辑订阅卡片
            $("#J_card_edit").click(function(){


                $(".dialogContentContainer").css({width:200}).removeClass("hidden").animate({
                    width:dialogWidth,
                    opacity:1
                },500)
            })
            //去掉填写的需求
            $("#J_xuqiu_cancel").click(function(){
                $(".dialogContentContainer").animate({width:200,opacity:0},500,function(){
                    $(".dialogContentContainer").addClass("hidden")
                })
            })
        },
        _renderSelected:function(selectedSeries,selectedBrands){
            var html = "";
            for(var i=0;i<selectedSeries.length;i++) {
                var series = selectedSeries[i].split(",");
                var _code = series[0];
                var _name = series[1];
                html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/series/"+_code+".png'/>"+_name+"</div>"
            }
            for(var i=0;i<selectedBrands.length;i++) {
                var series = selectedBrands[i].split(",");
                var _code = series[0];
                var _name = series[1];
                html+="<div class='selected-item' code='"+_code+"'><img src='http://res.souche.com/files/carproduct/brand/"+_code+".png'/>"+_name+"</div>"
            }
            $(".selected_series_result").html(html);

        }
    }
});
/**
 * Created by Administrator on 2014/7/1.
 */
define('index/collect',[],function() {
    var collectControl = {};
    var config = {};
    var collecting = false;
    var phoneReg = /^1[3458][0-9]{9}$/;
    var is_requesting = false;
    var _bind = function() {
        $(".carCollect").live("click", function() {
            var context = this;
            if (is_requesting) return;
            Souche.MiniLogin.checkLogin(function() {
                if ($(context).hasClass("colled")) {
                    var carID = $(context).attr("data-carid");
                    deleteCollect.call(context, carID);
                } else {
                    var carID = $(context).attr("data-carid");
                    addCollect.call(context, carID);
                }
            });
            return false;
        });

        $("#noreg-phone-form .submit").click(function() {
            $("#noreg-phone-form").submit();
            return false;
        });

    };

    var init = function(_config) {
        $.extend(config, _config);

        $(".item .itemTail .carCollect , .itemInfo .carCollect").hover(function() {
            $(this).addClass("hover");
        }, function() {
            $(this).removeClass("hover");
        });

        _bind();
    };


    //function begin
    function addCollect(carID) {
        var self = this;
        var url = config.api_saveFavorite;
        var collecting = true;
        is_requesting = true;
        if (collecting) {
            collecting = false;
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    phone: $("#fav-phone").val() || $.cookie("noregisteruser"),
                    carType: config.carType,
                    carId: carID
                },
                context: self
            }).done(function(data) {
                is_requesting = false;
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {

                    $("#fav-popup").addClass("hidden");
                    $(".wrapGrayBg").hide();
                    $(this).find("span").html($(this).find("span").html() * 1 + 1);
                    $(this).addClass("colled");

                }
                collecting = false;
            });
        }
    }

    function deleteCollect(carID) {
        var self = this;
        is_requesting = true;
        $.ajax({
            url: config.api_delFavorite,
            data: {
                carId: carID //$(self).attr("data-carid")
            },
            dataType: "json",
            type: "post",
            context: self,
            success: function(data) {
                is_requesting = false;
                if (data.errorMessage) {
                    alert(data.errorMessage)
                } else {
                    //var num =parseInt($(this).find("span").html());
                    $(this).find("span").html($(this).find("span").html() * 1 - 1);
                    $(this).removeClass("colled");
                }

                collecting = false;
            }
        })
    }

    //function end

    collectControl.init = init;

    return collectControl;
});
/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2012 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.3
 *
 */
(function(a,b,c,d){var e=a(b);a.fn.lazyload=function(c){function i(){var b=0;f.each(function(){var c=a(this);if(h.skip_invisible&&!c.is(":visible"))return;if(!a.abovethetop(this,h)&&!a.leftofbegin(this,h))if(!a.belowthefold(this,h)&&!a.rightoffold(this,h))c.trigger("appear"),b=0;else if(++b>h.failure_limit)return!1})}var f=this,g,h={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!0,appear:null,load:null};return c&&(d!==c.failurelimit&&(c.failure_limit=c.failurelimit,delete c.failurelimit),d!==c.effectspeed&&(c.effect_speed=c.effectspeed,delete c.effectspeed),a.extend(h,c)),g=h.container===d||h.container===b?e:a(h.container),0===h.event.indexOf("scroll")&&g.bind(h.event,function(a){return i()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,c.one("appear",function(){if(!this.loaded){if(h.appear){var d=f.length;h.appear.call(b,d,h)}a("<img />").bind("load",function(){c.hide().attr("src",c.data(h.data_attribute))[h.effect](h.effect_speed),b.loaded=!0;var d=a.grep(f,function(a){return!a.loaded});f=a(d);if(h.load){var e=f.length;h.load.call(b,e,h)}}).attr("src",c.data(h.data_attribute))}}),0!==h.event.indexOf("scroll")&&c.bind(h.event,function(a){b.loaded||c.trigger("appear")})}),e.bind("resize",function(a){i()}),/iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent.persisted&&f.each(function(){a(this).trigger("appear")})}),a(b).load(function(){i()}),this},a.belowthefold=function(c,f){var g;return f.container===d||f.container===b?g=e.height()+e.scrollTop():g=a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return f.container===d||f.container===b?g=e.width()+e.scrollLeft():g=a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return f.container===d||f.container===b?g=e.scrollTop():g=a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return f.container===d||f.container===b?g=e.scrollLeft():g=a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!a.rightoffold(b,c)&&!a.leftofbegin(b,c)&&!a.belowthefold(b,c)&&!a.abovethetop(b,c)},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})})(jQuery,window,document);
define("lib/lazyload", function(){});

/**
 * Created by Administrator on 2014/7/1.
 */
define('index/carConstrast',[],function() {
    var constrastControl = {};
    var constrasting = false;
    var config = {};
    var phoneReg = /^1[3458][0-9]{9}$/;

    var _bind = function() {
        $(".carConstrast span,.carConstrast input").live("click", function(e) {

            var element = e.target || e.srcElement;
            if (element.nodeName == "INPUT") {
                if (this.checked) {
                    var carID = $(this).parent().attr("carid");
                    addConstrast.call(this, carID);
                } else {
                    var constrastID = $(this).parent().attr("contrastid");
                    deleteConstrast.call(this, constrastID);
                }
            } else if (element.nodeName == "SPAN") {
                if ($(this).parent().find("input")[0].checked) {
                    var constrastID = $(this).parent().attr("contrastid");
                    deleteConstrast.call(this, constrastID);

                } else {
                    var carID = $(this).parent().attr("carid");
                    var input = $(this).parent().find("input")[0];
                    addConstrast.call(input, carID);
                    input.checked = true;
                }
            }
            e.stopPropagation();
            e.preventDefault();
        });
    }

    //function begin

    function deleteConstrast(constrastID) {
        var url = config.api_deleteContrast;
        var self1 = this;

        $.ajax({
            url: url,
            data: {
                cid: constrastID
            },
            dataType: "json",
            context: self1
        }).done(function(result) {
            $(this).parent().find("input")[0].checked = false;
        });
    }

    function addConstrast(carID) {
        var url = config.api_addContrast;
        var self = this;
        var constrasting = true;

        if (constrasting) {
            Souche.MiniLogin.checkLogin(function(){
                $.ajax({
                    type: "POST",
                    url: config.api_addContrast,
                    data: {
                        carId: carID
                    },
                    dataType: "json",
                    context: self
                }).done(function(data) {
                    if (data.result == 2) { //正常
                        this.checked = true;
                        $(this).parent().find("input")[0].checked = true;

                        var contrastId = data.contrastId;
                        $(this).parent().attr("contrastId", contrastId);

                        var cloneElement = $(this).parent().clone();
                        cloneElement.css({
                            opacity: 0.8,
                            position: 'absolute',
                            top: $(this).parent().offset().top + 'px',
                            left: $(this).parent().offset().left + 'px',
                            backgroundColor: "#FF4400",
                            color: "#fff"
                        });

                        var endX = $(".side-box .contrast-img").offset().left;
                        var endY = $(".side-box .contrast-img").offset().top;

                        document.body.appendChild(cloneElement[0]);
                        cloneElement.animate({
                            top: endY,
                            left: endX
                        }, 500, function() {
                            cloneElement.remove();
                        });
                    } else if (data.result == -1) { // 已经添加
                        this.checked = true;
                        var waring = $(this).parent().parent().parent().find(".contrast-waring");
                        waring.html("已经加入对比").removeClass("hidden");
                        $(this).parent().find("input")[0].checked = true;
                        window.setTimeout(function() {
                            waring.addClass("hidden");
                        }, 3000);

                        var contrastId = data.contrastId;
                        $(this).parent().attr("contrastId", contrastId);
                    } else if (data.result == 1) //已满
                    {
                        var waring = $(this).parent().parent().parent().find(".contrast-waring");
                        waring.html("对比项已满").removeClass("hidden");
                        $(this).parent().find("input")[0].checked = false;
                        window.setTimeout(function() {
                            waring.addClass("hidden");
                        }, 3000);
                    }

                    constrasting = false;
                });
            })

        }
    }
    //function end

    var init = function(_config) {
        $.extend(config, _config);
        _bind();
    }

    constrastControl.init = init;
    return constrastControl;
});
/**
 * 是否加入心愿单的tip
 */
define('index/record-tip',[],function() {
    var config = {}
    var submitData = {}
    var labels = []
    return {
        init: function(_config) {
            config = _config;
            $.ajax({
                url: config.api_showTipUrl,
                dataType: "json",
                success: function(data) {
                    if (data.code == 200 && data.userTags && (data.userTags.brands || data.userTags.maxPrice || data.userTags.minPrice)) {
                        $(".record_warning").removeClass("hidden")
                    }
                    if (data.userTags && data.userTags.brands) {
                        for (var i = 0; i < data.userTags.brands.length; i++) {
                            var item = data.userTags.brands[i];
                            if (submitData[item.parameter]) {

                            } else {
                                submitData[item.parameter] = []
                            }
                            submitData[item.parameter].push(item.code)
                            labels.push("<em>" + item.name + "</em>")

                        }
                        if (data.userTags.maxPrice && data.userTags.minPrice) {
                            labels.push("<em>" + (data.userTags.minPrice / 10000).toFixed(0) + "-" + (data.userTags.maxPrice / 10000).toFixed(0) + "万" + "</em>" + "的车")
                        }
                        $(".record_warning span").html(labels.join("，"))
                    }
                    if (data.userTags && data.userTags.maxPrice) {
                        submitData['maxPrice'] = (data.userTags.maxPrice / 10000).toFixed(0)
                    }
                    if (data.userTags && data.userTags.minPrice) {
                        submitData['minPrice'] = (data.userTags.minPrice / 10000).toFixed(0)
                    }

                }
            });

            $(".record_warning .close").on("click", function(e) {
                e.preventDefault();
                $.ajax({
                    url: config.api_noShowTipUrl,
                    dataType: "json",
                    success: function() {
                        $(".record_warning").addClass("hidden")
                    }
                });
            });
            $(".record_warning .add").on("click", function(e) {
                e.preventDefault();
                var url = config.submit_api + "?tagTip=1&";
                // for (var o in submitData) {
                //     url += o + "=" + submitData[o].join() + "&"
                // }
                var is = ["brands","series","maxPrice","minPrice","minYear","maxYear"]
                var data = {
                    brands:[],
                        series:[],
                    startYear:null,
                    endYear:null,
                    minPrice:null,
                    maxPrice:null
                }

                //合并两处需求到一起
                if (config.userRequirementJsonForTag) {
                    for (var i in data) {
                        var item = config.userRequirementJsonForTag[i];
                        if (item && item.length) {
                            for (var m = 0; m < item.length; m++) {
                                item[m] = item[m].split(",")[0];
                            }
                            if (submitData[i] && submitData[i].join) {
                                data[i] = item.concat(submitData[i])
                            }else{
                                data[i] = item
                            }
                        } else {
                            if (submitData[i]) {
                                data[i] = submitData[i];
                            }else{
                                if(config.userRequirementJsonForTag[i]){
                                    data[i] = config.userRequirementJsonForTag[i]
                                }

                            }
                        }
                    }
                }
//                for (var o in data) {
//                    if (data[o]&&data[o].join) {
//                        url += o + "=" + data[o].join(",") + "&"
//                    } else {
//                        url += o + "=" + data[o] + "&"
//                    }
//
//                }
                Souche.MiniLogin.checkLogin(function(){
                    $.ajax({
                        url: url,
                        data:{
                            brands:data.brands.join(","),
                            series:data.series.join(","),
                            minYear:data.startYear,
                            maxYear:data.endYear,
                            minPrice:data.minPrice,
                            maxPrice:data.maxPrice
                        },
                        dataType: "json",
                        success: function() {
                            window.location.reload();
                        },
                        error: function() {}
                    });
                })


            });
        }
    }
});
define('souche/util/image-resize',[],function() {
    /**
     * 让图片自动填充满一个区域
     */
    return {
        init: function(selector, width, height) {
            $(selector).each(function(i, img) {
                img.onload = function() {
                    var w = this.width;
                    var h = this.height;
                    if (h == 0 || w / h <= width / height) {
                        $(this).css({
                            width: "100%",
                            height: "auto"
                        })
                    } else {
                        $(this).css({
                            height: "100%",
                            width: "auto"
                        })
                        $(img).css({
                            marginLeft: width / 2 - $(img).width() / 2
                        })
                        $(window).on("resize", function() {
                            $(img).css({
                                marginLeft: width / 2 - $(img).width() / 2
                            })
                        })
                    }
                }
            })
        }
    }
});
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    var mustache = {};
    factory(mustache);
    if (typeof define === "function" && define.amd) {
      define('lib/mustache',mustache); // AMD
    } else {
      root.Mustache = mustache; // <script>
    }
  }
}(this, function (mustache) {

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var nonSpaceRe = /\S/;
  var eqRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function escapeTags(tags) {
    if (!isArray(tags) || tags.length !== 2) {
      throw new Error('Invalid tags: ' + tags);
    }

    return [
      new RegExp(escapeRegExp(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRegExp(tags[1]))
    ];
  }

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all template text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices
   * in the original template of the token, respectively.
   *
   * Tokens that are the root node of a subtree contain two more elements: an
   * array of tokens in the subtree and the index in the original template at which
   * the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    tags = tags || mustache.tags;
    template = template || '';

    if (typeof tags === 'string') {
      tags = tags.split(spaceRe);
    }

    var tagRes = escapeTags(tags);
    var scanner = new Scanner(template);

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          delete tokens[spaces.pop()];
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(tagRes[0]);
      if (value) {
        for (var i = 0, len = value.length; i < len; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(['text', chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(tagRes[0])) break;
      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(eqRe);
        scanner.scan(eqRe);
        scanner.scanUntil(tagRes[1]);
      } else if (type === '{') {
        value = scanner.scanUntil(new RegExp('\\s*' + escapeRegExp('}' + tags[1])));
        scanner.scan(curlyRe);
        scanner.scanUntil(tagRes[1]);
        type = '&';
      } else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // Match the closing tag.
      if (!scanner.scan(tagRes[1])) {
        throw new Error('Unclosed tag at ' + scanner.pos);
      }

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection) {
          throw new Error('Unopened section "' + value + '" at ' + start);
        }
        if (openSection[1] !== value) {
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
        }
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        tagRes = escapeTags(tags = value.split(spaceRe));
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();
    if (openSection) {
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
    }

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      var string = match[0];
      this.tail = this.tail.substring(string.length);
      this.pos += string.length;
      return string;
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view == null ? {} : view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var value;
    if (name in this.cache) {
      value = this.cache[name];
    } else {
      var context = this;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;

          var names = name.split('.'), i = 0;
          while (value != null && i < names.length) {
            value = value[names[i++]];
          }
        } else {
          value = context.view[name];
        }

        if (value != null) break;

        context = context.parent;
      }

      this.cache[name] = value;
    }

    if (isFunction(value)) {
      value = value.call(this.view);
    }

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null) {
      tokens = cache[template] = parseTemplate(template, tags);
    }

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    var self = this;
    function subRender(template) {
      return self.render(template, context, partials);
    }

    var token, value;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
        value = context.lookup(token[1]);
        if (!value) continue;

        if (isArray(value)) {
          for (var j = 0, jlen = value.length; j < jlen; ++j) {
            buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
          }
        } else if (typeof value === 'object' || typeof value === 'string') {
          buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
        } else if (isFunction(value)) {
          if (typeof originalTemplate !== 'string') {
            throw new Error('Cannot use higher-order sections without the original template');
          }

          // Extract the portion of the original template that the section contains.
          value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

          if (value != null) buffer += value;
        } else {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '^':
        value = context.lookup(token[1]);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0)) {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '>':
        if (!partials) continue;
        value = this.parse(isFunction(partials) ? partials(token[1]) : partials[token[1]]);
        if (value != null) buffer += this.renderTokens(value, context, partials, originalTemplate);
        break;
      case '&':
        value = context.lookup(token[1]);
        if (value != null) buffer += value;
        break;
      case 'name':
        value = context.lookup(token[1]);
        if (value != null) buffer += mustache.escape(value);
        break;
      case 'text':
        buffer += token[1];
        break;
      }
    }

    return buffer;
  };

  mustache.name = "mustache.js";
  mustache.version = "0.8.0";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

/**
 * Created by tianqi on 14-9-11.
 */
define('souche/core-data',['lib/mustache'],function(Mustache){

    var CoreData = function(struct){
        this.data = $.extend({},struct);
        this.binds = [];
        var self = this;
        $(this).on("change",function(){
            for(var i=0;i<self.binds.length;i++){
                var item = self.binds[i];
                $(item.selector).html(Mustache.render(item.tpl,self.data))
            }
        })
    }
    CoreData.prototype = {
        set:function(key,value) {
            if(this.data[key]!=value){
                this.data[key] = value;
                $(this).trigger("change")
            }
        },
        setAll:function(obj){
            $.extend(this.data,obj)
            $(this).trigger("change")
        },
        get:function(key){
            return this.data[key];
        },
        bindToDOM:function(selector,tpl){
            this.binds.push({
                selector:selector,
                tpl:tpl
            })
        }
    }
    return function(struct){
        var data = new CoreData(struct)
        return data;
    }
})


//var data = CoreData({
//    id:0,
//    time:100,
//    date:new Date()
//})
//
//data.set
//data.get
//data.data
//$(data).on("change",function(){})
//data.bindToDOM("#id",tpl);
define('souche/time-countdown',['souche/core-data'],function(CoreData) {

    var CountDown = function(selector,tpl){
        var data = this.data = CoreData({
            day:0,
            hour:0,
            minute:0,
            second:0
        })
        if(!tpl)
        var tpl = "<span>剩余：<ins>{{day}}</ins>&nbsp;天&nbsp;<ins>{{hour}}</ins>&nbsp;时&nbsp;<ins>{{minute}}</ins>&nbsp;分&nbsp;<ins>{{second}}</ins>&nbsp;秒</span>"
        data.bindToDOM(selector,tpl)
        var counter = this.counter = {
            endYear: $(selector).attr("endYear"),
            endMonth: $(selector).attr("endMonth"),
            endDay: $(selector).attr("endDay"),
            endHour: $(selector).attr("endHour")
        }
        this.endDate = new Date(counter.endYear, counter.endMonth, counter.endDay, counter.endHour, 0, 0);
    }
    CountDown.prototype = {
        init:function(){
            var self = this;
            setInterval(function(){
                self.check();
            },100)
        },
        check:function(){
            var offset = this.endDate.getTime() - (new Date().getTime());
            if(offset<0) offset = 0;
            this.data.setAll({
                day:Math.floor(offset / 24 / (3600 * 1000)),
                hour:Math.floor(offset / (3600 * 1000) % 24),
                minute:Math.floor(offset % (3600 * 1000) / (60 * 1000)),
                second:Math.floor(offset % (3600 * 1000)% (60 * 1000)/1000)
            })
        }
    }
    return {
        init:function(selector,tpl){
           var down = new CountDown(selector,tpl);
           down.init()
        }

    }
});
define('index/mod/loadCars',['lib/mustache',"souche/util/image-resize",],function(Mustache,ImageResize){
    var nowTabCode = 0;
    var pageInfos = {

    }
    var endInfos = {

    }
    var isLoading = false;
    var loadOtherMore = function(code){
        if(isLoading) return;
        if(endInfos[code]){
            return;
        }
        if(!pageInfos[code]){
            pageInfos[code]= 0;
        }
        pageInfos[code]++;
        var url = config.getMoreOtherCars_api;
        var carContent = $(".carsModule "+".carContent-"+code);
        isLoading = true;
        if( pageInfos[code]>2){
            carContent.append("<div class=loading></div>")
        }
        var carTemplate = $("#carTemplate").html();
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            data:{
                page:pageInfos[code],
                searchCode:code
            }
        }).done(function(result) {
            $(".loading",carContent).remove()
            if (result.code == 204) {

            } else {
                var list = result.pageData.items;
                if (list.length == 0) {
                    endInfos[code]=true;
                } else {

                    var template = "";
                    for (var idx = 0, len = list.length; idx < len; idx++) {
                        list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                        list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
                        template += Mustache.render(carTemplate,list[idx])
                    }
                    $(".cars",carContent).append(template);
                    ImageResize.init($(".img",carContent), 240, 160);
                }
                $(".carsMore",carContent).remove();

            }
            isLoading = false;
        });
    }
    var loadOtherCars = function(code){
        if(!pageInfos[code]){
            pageInfos[code]= 0;
        }
        pageInfos[code]++;
        var url = config.getMoreOtherCars_api;
        var carContent = $(".carsModule "+".carContent-"+code);
        isLoading = true;
        var carTemplate = $("#carTemplate").html();

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            data:{
                page:pageInfos[code],
                searchCode:code
            }
        }).done(function(result) {

            if (result.code == 204) {

            } else {
                var list = result.pageData.items;
                if (list.length == 0) {

                } else {
                    var template = "";
                    for (var idx = 0, len = list.length; idx < len; idx++) {
                        list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                        list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
                        template += Mustache.render(carTemplate,list[idx])
                    }
                    carContent.html("<div class='clearfix cars'>"+template+"</div>");

                    carContent.append("<div class='carsMore'><span>查看更多</span></div>")
                    ImageResize.init($(".img",carContent), 240, 160);
                }

                $(".carsMore",carContent).on("click",function(){
                    $("span",$(this)).html("正在加载中")
                    loadOtherMore(code);
                })

            }
            isLoading = false;
        });
    }
    var config = {}
    return {
        init:function(_config){
            config = _config;
            var isdialogShow = !$(".dialogContentContainer").hasClass("hidden");
            ///change tab
            $("#carsNav li").click(function() {
                $("#carsNav li").removeClass("active");
                $(this).addClass("active");
                var id = $(this).attr("id");
                tabID = id;
                $(window).trigger("tab_change", id)
                $(".carsContent").addClass("hidden");
                $(".carsContent." + tabID + "Content").removeClass("hidden");
                if (id === "myAdviser"||id == "hotNewCars") {
                    $(".guess-like").removeClass("hidden")
                }else{
                    $(".guess-like").addClass("hidden")
                }
                if (id === "myAdviser") {
//                    initAnimate(".myAdviser");
                    if(isdialogShow){
                        $(".dialogContentContainer").removeClass("hidden")
                    }

                } else if (id == "hotNewCars") {
                    $(".hotNewCars img").each(function(i, img) {
                        $(img).attr("src", $(img).attr("data-original"));
                    })
                    $(".hotCarImages img").each(function(i, img) {
                        $(img).attr("src", $(img).attr("data-original"));
                    })
                    if($(".new-tip").length){
                        $.ajax({
                            url:contextPath+"/pages/homePageAction/markReadHotCar.json"
                        })
                    }
                    if(isdialogShow){
                        $(".dialogContentContainer").removeClass("hidden")
                    }
                }else{
                    var carContent;
                    var code = $(this).attr("searchcode");
                    if($(".carsModule "+".carContent-"+code).length){
                        carContent = $(".carsModule "+".carContent-"+code)
                    }else{
                        carContent = $("<div class='carsContent carContent-"+code+"' data-code='"+code+"'><div class=loading></div></div>")
                        carContent.appendTo($(".otherCarsContents"))
                        loadOtherCars(code)
                    }
                    carContent.removeClass("hidden")

                    $(".dialogContentContainer").addClass("hidden")

                }

                return false;
            });
            $(window).scroll(function() {
                if($("#hotNewCars").hasClass("active")||$("#myAdviser").hasClass("active")){
                    return;
                }else{

                    var activeContent = $(".otherCarsContents .carsContent:not(.hidden)")
                    if($(".carsMore",activeContent).length){
                        return;
                    }
                    var code = activeContent.attr("data-code");
                    if (($("#footer").offset().top - 600) <= ($(window).scrollTop() + $(window).height())) {
                        loadOtherMore(code);
                    }
                }

            });
        }
    }
});
define('index/index',['index/car-god',
    'index/top-nav',
    "index/qiugou",
    'souche/custom-select',
    "index/collect",
    "lib/lazyload",
    "index/carConstrast",
    "index/record-tip",
    "souche/util/image-resize",
    "souche/time-countdown",
    "index/mod/loadCars",
    "lib/mustache"
], function(carGod,
            topNav,
            qiugou,
            customSelect,
            collect,
            lazyload,
            carConstrast,
            recordTip,
            ImageResize,
            TimeCountDown,
            loadCars,
            Mustache) {
    var config = {};
    var myAdviserPageIndex = 1,
        hotNewCarsPageIndex = 0;

    var _bind = function() {
        var timeout = null;

        var carTemplate = $("#carTemplate").html();
        var adviser_end = false;
        var newcar_end = false;
        var getMore = function(id) {
            $("." + $("#carsNav li.active").attr("id") + ".carsMore span").html("正在获取");
            var self = this;
            if ($(this).hasClass("myAdviser-more") || id == "myAdviser") {
                if (adviser_end) return;
                myAdviserPageIndex++;
                console.log(myAdviserPageIndex)
                var url = config.getMoreUserRecommend_api + "=" + myAdviserPageIndex;
                $(self).find("span").html("正在加载中...")
                if (myAdviserPageIndex > 2) {
                    $(".myAdviser-loading").removeClass("hidden")
                }

                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json"
                }).done(function(result) {
                    $(self).find("span").html("查看更多")
                    $(".myAdviser-loading").addClass("hidden")
                    $(".carsMore.myAdviser-more").remove();
                    if (result.code == 204) {} else {
                        var list = result.recommendCars;
                        var list = result.recommendCars.items;
                        var template = "";
                        for (var idx = 0, len = list.length; idx < len; idx++) {
                            list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                            list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
                            template += Mustache.render(carTemplate,list[idx])
                        }


                        $(".myAdviserContent .myAdviser").eq(0).append(template);
                        ImageResize.init($(".img",$(".myAdviserContent .myAdviser")), 240, 160);
                        $(".myAdviserContent .myAdviser-more").remove();
                        if (result.hasNext) {

                        } else {
                            adviser_end = true;
                        }


                    }
                    isScrolling = true;
                });
            } else {
                if (newcar_end) return;

                hotNewCarsPageIndex++;
                var url = config.getMoreHotCars_api + hotNewCarsPageIndex;
                $(self).find("span").html("正在加载中...")
                if (hotNewCarsPageIndex > 2) {
                    $(".hotNewCars-loading").removeClass("hidden")
                }

                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json"
                }).done(function(result) {
                    $(self).find("span").html("查看更多")
                    $(".hotNewCars-loading").addClass("hidden")
                    $(".carsMore.hotNewCars-more").remove();
                    if (result.code == 204) {

                    } else {
                        var list = result.newCars.items;
                        if (list.length == 0) {
                            newcar_end = true;
                        } else {
                            var template = "";
                            for (var idx = 0, len = list.length; idx < len; idx++) {
                                list[idx].url = (contextPath + "/pages/choosecarpage/choose-car-detail.html?carId=" + list[idx].id);
                                list[idx].isZaishou = !!(list[idx].carVo.status == "zaishou")
                                template += Mustache.render(carTemplate,list[idx])
                            }
                            $(".hotNewCarsContent .hotNewCars").eq(0).append(template);
                            ImageResize.init($(".img",$(".hotNewCarsContent .hotNewCars")), 240, 160);

                        }


                    }
                    isScrolling = true;
                });
            }
        }

        var isScrolling = true;
        //查看更多
        $(".carsMore").click(function() {
            getMore.call(this);
            var self = this;
            $(window).scroll(function() {
                if($("#hotNewCars").hasClass("active")||$("#myAdviser").hasClass("active")){
                    if ($("." + $("#carsNav li.active").attr("id") + "Content .carsMore").length == 0) {
                        if (($("#footer").offset().top - 600) <= ($(window).scrollTop() + $(window).height())) {
                            if (isScrolling) {
                                isScrolling = false;
                                getMore($("#carsNav li.active").attr("id"));
                            }
                        }
                    }
                }

            });
        });
    }


    return {
        init: function(_config) {
            $.extend(config, _config);
            $(document).ready(function() {
                $('.flexslider').flexslider({
                    animation: "slide",
                    slideshowSpeed: 5000,
                    directionNav: true,
                    controlNav: true,
                    pauseOnHover: true
                });
                $(".right-slide").flexslider({
                    slideshow: false,
                    animation: "slide",
                    slideshowSpeed: 5000,
                    controlNav: true,
                    animationLoop: false,
                    randomize: true,
                    directionNav: false

                });
                $(".flex-direction-nav").hide();
                $(".main-slider").mouseenter(function() {
                    $(".flex-direction-nav").fadeIn("normal");
                });
                $(".main-slider").mouseleave(function() {
                    $(".flex-direction-nav").fadeOut("normal");
                });
            });
            _bind();
            carGod.init();
            topNav.init();


            qiugou.init(config);
            carConstrast.init(config);



            $(".down-counter").each(function() {
                var $this = $(this);
                TimeCountDown.init($this);
            });


            collect.init(config);

            $(".carsContent img").lazyload({
                threshold: 200
            });

            $(".card-login").click(function() {
                Souche.MiniLogin.checkLogin(function() {
                    window.location.reload();
                })
            })
            // 获取"猜你喜欢"的数据, 用apear方法控制lazy加载到dom
            function initGuessLike(){
                var guessLikeCtn = $(".guess-like");
                guessLikeCtn.addClass('loading');
                $.ajax({
                    url: config.api_guessCars,
                    success: function(html) {

                        Souche.Util.appear( ".guess-like", fillGuessCallback );
                        $(window).trigger("scroll")
                        function fillGuessCallback(){
                            guessLikeCtn.removeClass('loading');
                            guessLikeCtn.html(html);
                            ImageResize.init(".guess-like .carsItem img", 240, 160);
                            // "不喜欢"事件处理
                            guessLikeCtn.on('click', '.nolike', function(e) {
                                var self = this;
                                $(self).closest(".like-box").animate({
                                    opacity: 0,
                                    width: 0
                                }, 500, function() {
                                    $(self).closest(".like-box").remove()
                                })
                                $.ajax({
                                    url: config.api_nolikeUrl,
                                    data: {
                                        carId: $(this).attr("data-id")
                                    },
                                    dataType: "json",
                                    success: function() {}
                                })
                            })
                        }
                    }
                });
            }
            initGuessLike();


            ImageResize.init(".carsItem .img", 240, 160);
            //提示品牌是否加入心愿单
            recordTip.init(config);
            loadCars.init(config);
            //闹着玩
            // Souche.Util.appear(".hotNewCars", function() {
            //     $(".hotNewCars .carItem").css({
            //         opacity: 0
            //     }).each(function(i, item) {
            //         setTimeout(function() {
            //             $(item).animate({
            //                 opacity: 1
            //             })
            //         }, i * 100)

            //     });
            // }, 300)

        }
    }

});
