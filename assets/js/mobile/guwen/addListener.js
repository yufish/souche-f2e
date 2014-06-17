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
            if(eType=='noLimitBrand'){

            }
        }
    }

    var seriesItemLtn={

    }

    var seriesSelectedLtn={

    }
    function addLtns(BrandMgr){
        BrandMgr.addLtn(brandIconLtn);
        BrandMgr.addLtn(brandSelectedLtn);
    }
    return addLtns;
})