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
                var code = e.item.code,
                    name = e.item.name;
                this.container.find('')
            }
            if(eType=='removeBrand'){

            }
            if(eType=='noLimitBrand'){

            }
        }
    }



    var brandSelectedLtn={
        container:$('#brand .selected-brand'),
        process:function(e){
            var eType = e['eventType'];
            if(eType=='addBrand'){
                var html = '<div class="sb-item" brand-code=' + e.item.code + '><span class="text">' + e.item.name + '</span>' + '<i class="close-icon"></i>' + '</div>';
                this.container.append(html)
            }
            if(eType=='removeBrand'){

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
    }
    return addLtns;
})