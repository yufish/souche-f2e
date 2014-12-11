/**
 * Created by zilong on 2014/5/28.
 */
!function(name,func,depenpencies){
    var hasDefine = (typeof define ==='function');
    if(hasDefine){
        depenpencies = depenpencies ||[];
        define(depenpencies,func);
    }else{
        this[name] = func();
    }

}('ltns',function(){
    var brandPaneLtn = {
        container : $('#brand-list .content'),
        process:function(e){
            var eType = e.eventType;
            if(eType=='addBrand'){
                var code = e.item.code;
                this.container.find('[data-code='+code+']').addClass('selected');
            }
            if(eType=='removeBrand'){
                var code = e.item.code;
                this.container.find('[data-code='+code+']').removeClass('selected');
            }
            if(eType=='noLimitBrand'){
                this.container.find('.item').removeClass('selected');
            }
        }
    };

    var makeSeriesDomByBrandLtn={
        content_container : $('#series-list .content-tabs'),
        tab_container:$('#selected-brands-pane .tab-items'),
        process:function(e){
            var eType = e.eventType;
            if(eType=='addBrand'){
                var item = e.item;
                var code = item.code,
                    name = item.name;
                this._makeSeriesUI(code,name);
                //this._makeTab(code,name);
            }
            if(eType=='removeBrand'){
                var code = e.item.code;
                this.content_container.find('.content[data-code='+code+']').remove();
                this.tab_container.find('.selected-brand-item[data-code='+code+']').remove();
            }
            if(eType=='noLimitBrand'){
                this.content_container.empty();
                this.tab_container.empty();
            }


        },
        _makeTab:function(bCode,bName){
            bName = bName.trim();
            var html = '<div class="selected-brand-item pane-selected-item" data-code="'+bCode+'"><span class="selected-brand-name">'+bName+'</span>(<span class="selected-num">0</span>)</div>'
            this.tab_container.append(html);
        },
        _makeSeriesUI:function(bCode,bName){
            var self =this;
            $.ajax({
                    url: contextPath + "/json/dict/loadRootLevelForCar.json",
                    dataType: "json",
                    data: {
                        type: "car-subdivision",
                        code: bCode
                    },
                success: function (_data) {
                    var data = _data.data
                    self._makeTab(bCode,bName);
                    var codes = data['codes'];

                    var start=  '<div class="content" data-code="'+bCode+'">'
                                +'<div class="clearfix" style="background: #524A4A">'
                                +   '<div class="title">'+bName+'</div>'
                                +   '<div class="buxian series-buxian" data-code="'+bCode+'">不限车系</div>'
                                +'</div>'

                    var end ='</div>';
                    var html = '';
                    for (var i in codes) {
                        html += '<div class="clearfix" >';
                        html += '<div class="series-title">' + i + '</div ><div class="series-name-wrapper">'
                        var s = codes[i];
                        for (var j in s) {
                            var b = s[j];
                            html += '<div class="series-item" data-code="' + b.code + '"><span class="series-name">' + b.name + '</span></div>';
                        }
                        html += '</div></div>';
                    }
                    self.content_container.append(start+html+end);
                }
            })
        }

    }


    var seriesPaneLtn={
        container :$('.content-tabs'),
        process:function(e){
            var eType = e.eventType;
            if(eType=='addSeries'){
                var sCode = e.item.code;
                this.container.find('.content[data-code="'+ e.brandCode+'"]')
                    .find('.series-item[data-code="'+sCode+'"]')
                    .addClass('selected');
            }
            if(eType=='removeSeries'){
                var sCode = e.item.code;
                this.container.find('.content[data-code="'+ e.brandCode+'"]')
                    .find('.series-item[data-code="'+sCode+'"]')
                    .removeClass('selected')
            }
            if(eType=='noLimitSeries'){
                var bCode = e.brandCode;
                this.container.find('.content[data-code="'+ e.brandCode+'"]')
                    .find('.series-item')
                    .removeClass('selected')
            }
        }

    }

    var selectedSeriesLtn={
        container:$('#series-pane .selected-items'),
        parent:$('#series-pane'),
        process:function(e){
            var eType = e.eventType;
            if(eType=='addSeries'){
                var code = e.item.code,
                    name = e.item.name,
                    bCode = e.brandCode;
                this._addSelectSeries(code,name,bCode);
                this.parent.show();
            }
            if(eType=='removeSeries'){
                var code= e.item.code;
                this.container.find('.selected-item[data-code='+code+']').remove();
                if(this.container.find('.selected-item').length==0){
                    this.parent.hide();
                }
            }
            if(eType=='noLimitSeries'){
                var bCode = e.brandCode;
                this.container.find('.selected-item[data-brand-code='+bCode+']').remove();
                if(this.container.find('.selected-item').length==0){
                    this.parent.hide();
                }
            }
            if(eType=='removeBrand'){
                var bCode = e.item.code;
                this.container.find('.selected-item[data-brand-code='+bCode+']').remove();
                if(this.container.find('.selected-item').length==0){
                    this.parent.hide();
                }
            }
            if(eType=='noLimitBrand'){
                this.container.empty();
                this.parent.hide();
            }

        },
        _addSelectSeries:function(code,name,bCode){
            var html =''
                +'<div class="selected-item" data-brand-code= "'+bCode+'" data-code="'+code+'">'
                +'<span class="selected-text">'+name+'</span>'
                +'<i class="close-icon"></i></div>';
            this.container.append(html);
        }
    };

    var seriesNumLtn={
        container:$('.tab-items'),
        process:function(e){
            var eType = e.eventType;
            if(eType=='addSeries'){
                var bCode = e.brandCode;
                var sNumDom = this.container
                    .find('.selected-brand-item[data-code="'+bCode+'"]')
                    .find('.selected-num');
                var i = (+sNumDom.text());
                sNumDom.text(i+1);
            }
            if(eType=='removeSeries'){
                var bCode = e.brandCode;
                var sNumDom = this.container
                    .find('.selected-brand-item[data-code="'+bCode+'"]')
                    .find('.selected-num');
                var i = (+sNumDom.text());
                sNumDom.text(i-1);
            }
            if(eType=='noLimitSeries'){
                var bCode = e.brandCode;
                var sNumDom = this.container
                    .find('.selected-brand-item[data-code="'+bCode+'"]')
                    .find('.selected-num');
                sNumDom.text(0);
            }
        }
    }

//    var brandRemainingNumLtn={
//        numDom:$('#remain-brand-num'),
//        process:function(e){
//            var numDom = this.numDom;
//            var eType = e.eventType;
//            if(eType=='addBrand'){
//                numDom.text(e.bLen);
//            }
//            if(eType=='removeBrand'){
//                numDom.text(e.bLen);
//            }
//            if(eType=='noLimitBrand'){
//                numDom.text(0);
//            }
//        }
//    }

    function addLtns(BrandMgr){
        BrandMgr.addLtn(brandPaneLtn);
        BrandMgr.addLtn(makeSeriesDomByBrandLtn);
        //BrandMgr.addLtn(selectedBrandsLtn);
        BrandMgr.addLtn(seriesPaneLtn);
        BrandMgr.addLtn(selectedSeriesLtn);
        BrandMgr.addLtn(seriesNumLtn);
        //BrandMgr.addLtn(brandRemainingNumLtn);
    }
    return addLtns;
})