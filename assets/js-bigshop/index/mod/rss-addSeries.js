define(['souche/util/load-info'],function(LoadInfo){
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