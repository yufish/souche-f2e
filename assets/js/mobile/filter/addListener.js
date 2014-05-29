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
                this._makeSeriesUI(code);
                this._makeTab(code,name);
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
        _makeSeriesUI:function(bCode){
            var self =this;
            $.ajax({
                url: contextPath + "/pages/dicAction/loadExistSeries.json",
                dataType: "json",
                data: {
                    type: "car-subdivision",
                    code: bCode
                },
                success: function (data) {
                    var codes = data['codes'];
                    var start='<div class="content" data-code="'+bCode+'">';
                    var end ='</div>';
                    var html = '';
                    for (var i in codes) {
                        html += '<div class="clearfix">';
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

    var selectedBrandsLtn ={
        container: $('#brand-pane .selected-items'),
        parent:$('#brand-pane'),
        process:function(e){
            var eType = e.eventType;
            if(eType == 'addBrand'){
                var code = e.item.code,
                    name = e.item.name;
                this._addSelectedBrand(code,name);
                this.parent.show();
            }
            if(eType=='removeBrand'){
                var code = e.item.code;
                this.container.find('.selected-item[data-code='+code+']').remove();
                if(e.bLen==0){
                    this.parent.hide();
                }
            }
            if(eType=='noLimitBrand'){
                this.container.empty();
                this.parent.hide();
            }
        },
        _addSelectedBrand:function(code,name){
            var html =''
                    +'<div class="selected-item" data-code="'+code+'">'
                        +'<span class="selected-text">'+name+'</span>'
                    +'<i class="close-icon"></i></div>'
            this.container.append(html);
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
        }
    }

    function addLtns(BrandMgr){
        BrandMgr.addLtn(brandPaneLtn);
        BrandMgr.addLtn(makeSeriesDomByBrandLtn);
        BrandMgr.addLtn(selectedBrandsLtn);
        BrandMgr.addLtn(seriesPaneLtn);
    }
    return addLtns;
})