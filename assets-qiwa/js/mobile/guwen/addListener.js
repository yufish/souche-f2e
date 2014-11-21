!function(name,func,depenpencies){
    var hasDefine = (typeof define ==='function');
    if(hasDefine){
        depenpencies = depenpencies ||[];
        define(depenpencies,func);
    }else{
        this[name] = func();
    }

}('listeners',function(){

    var brandIconLtn ={
        container:$('#brand-icons-container'),
        process:function(e){
            var eType = e['eventType'];
            if(eType=='addBrand'){
                var code = e.item.code
                //var name = e.item.name;
                this.container.find('.icon-item[data-code='+code+']').addClass('selected');
            }
            if(eType=='removeBrand'){
                var code = e.item.code;
                this.container.find('.icon-item[data-code='+code+']').removeClass('selected');
            }

        }
    }



    var brandSelectedLtn={
        container:$('#brand #selected-brand'),
        process:function(e){
            var eType = e['eventType'];
            if(eType=='addBrand'){
                var html = '<div class="sb-item" data-code=' + e.item.code + '><span class="text">' + e.item.name + '</span>' + '<i class="close-icon"></i>' + '</div>';
                this.container.show();
                this.container.append(html)

            }
            if(eType=='removeBrand'){
                this.container.find('.sb-item[data-code='+ e.item.code+']').remove();
                if(e.bLen==0){
                    this.container.hide();
                }
            }
        }
    }

    var getSeriesByBrandCodeLtn={
        container:$('#series-container'),
        process:function(e){
            var eType = e['eventType'];
            if(eType=='addBrand'){
                var code = e.item.code,
                    name = e.item.name;
                this._makeSeriesUI(code,name);
            }
            if(eType=='removeBrand'){
                var code = e.item.code;
                this.container.find('.content[data-code='+code+']').remove();
            }
        },
        _makeSeriesUI:function(bCode,bName){
            var self =this;
            $.ajax({
                url: contextPath + "/pages/dicAction/loadRootLevelForCar.json",
                dataType: "json",
                data: {
                    type: "car-subdivision",
                    code: bCode
                },
                success: function (data) {
                    var selectSeriesCodeNameMap ={};

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
                            if(b.code in window.seriesBrandMap){
                                selectSeriesCodeNameMap[b.code] = b.name;
                            }
                        }
                        html += '</div></div>';
                    }
                    self.container.append(start+html+end);

                    for(var i in selectSeriesCodeNameMap){
                        brandManager.addSeries(i,selectSeriesCodeNameMap[i],bCode);
                    }
                }
            })
        }
    }

    var seriesItemLtn={
        container:$('#series-container'),
        process:function(e){
            var eType = e['eventType'];
            if(eType=='addSeries'){
                var code = e.item.code;
                this.container.find('.series-item[data-code='+code+']').addClass('selected');
            }
            if(eType=='removeSeries'){
                var code = e.item.code;
                this.container.find('.series-item[data-code='+code+']').removeClass('selected');
            }
            if(eType=='noLimitSeries'){
                var bCode = e.brandCode;
                this.container.find('.content[data-code='+bCode+']').find('.series-item').removeClass('selected');
            }
            if(eType =='removeBrand'){
                //TODO

            }
        }
    }

    var seriesSelectedLtn={
        container:$('#series #selected-series'),
        process:function(e){
            var eType = e['eventType'];
            if(eType=='addSeries'){
                var bCode = e.brandCode;
                var html = '<div class="ss-item" data-brand-code='+bCode+' data-code=' + e.item.code + '><span class="text">' + e.item.name + '</span>' + '<i class="close-icon"></i>' + '</div>';
                this.container.show();
                this.container.append(html)
            }
            if(eType=='removeSeries'){
                this.container.find('.ss-item[data-code='+ e.item.code+']').remove();
                if(this.container.find('.ss-item').length==0){
                    this.container.hide();
                }
            }
            if(eType=='noLimitSeries'){
                var bCode = e.brandCode;
                this.container.find('.ss-item[data-brand-code='+bCode+']').remove();
                if(this.container.find('.ss-item').length==0){
                    this.container.hide();
                }
            }
            if(eType=='removeBrand'){
                var bCode = e.item.code;
                this.container.find('.ss-item[data-brand-code='+bCode+']').remove();
                if(this.container.find('.ss-item').length==0){
                    this.container.hide();
                }
            }
        }
    }

    var brandManager=null;
    function addLtns(BrandMgr){
        brandManager = BrandMgr
        BrandMgr.addLtn(brandIconLtn);
        BrandMgr.addLtn(brandSelectedLtn);
        BrandMgr.addLtn(getSeriesByBrandCodeLtn);
        BrandMgr.addLtn(seriesItemLtn);
        BrandMgr.addLtn(seriesSelectedLtn);
    }
    return addLtns;
})