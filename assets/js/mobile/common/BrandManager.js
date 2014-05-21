/**
 * Created by zilong on 2014/5/21.
 */
!function(name,func,depenpencies){
    var hasDefine = (typeof define ==='function');
    if(hasDefine){
        depenpencies = depenpencies ||[];
        define(depenpencies,func);
    }else{
        this[name] = func();
    }

}('BrandMgr', function brandMgr(){
        var Brand = function(code,name,series){
            this.name = name;
            this.code = code;
            this.series = series ||[];
        }
        Brand.prototype = {
            addSeries:function(s,bCode){
                if(bCode){
                    if(bCode == this.code){
                        this.series.push(s);
                    }
                }else{
                    this.series.push(s);
                }
            }
        }
        Brand.NoLimit = 'NoLimit';
        var Series = function(code,name){
            this.name = name;
            this.code = code;
        }
        Series.NoLimit = 'NoLimit';

        //var BrandMgr =
        return {
            brands :[],
            ltns :[],
            addLtn :function(ltn){
                this.ltns.push(ltn);
            },
            notify:function(eData){
                for(var i =0;i<this.ltns.length;i++){
                    this.ltns[i].process(eData);
                }
            },
            addBrand:function(code,name,series){
                var b = new Brand(code ,name,series);
                this.brands.push(b);
                this.notify({
                    eventType:'addBrand',
                    item:b
                });
            },
            addSeries:function(code,name,bCode){
                if(!bCode)throw new TypeError('bCode should be non empty string');
                var brand = this._getBrandByCode(bCode);
                if(brand==null)throw new TypeError('cannot get brand by the given code');
                brand.addSeries(new Series(code ,name));
            },
            removeBrand:function(code){
                for(var  i = 0;i<this.brands.length;i++){
                    if(code==this.brands[i].code){
                        var dItem = this.brands.splice(i,1);
                        this.notify({
                            eventType:'removeBrand',
                            item:dItem
                        })
                    }
                }
            },
            removeSeries:function(code,bCode){
                if(!bCode)throw new TypeError('bCode should be non empty string');
                var brand = this._getBrandByCode(bCode);
                if(brand==null)throw new TypeError('cannot get brand by the given code');
                var series = brand.series;
                for(var i = 0;i<series.length;i++){
                    if(code == series[i]){
                        var dItem = series.splice(i,1);
                        this.notify({
                            eventType:'removeSeries',
                            brand:brand,
                            item:dItem
                        })
                    }
                }
            },
            _getBrandByCode:function(code){
                for(var i = 0;i<this.brands.length;i++){
                    var brand = this.brands[i]
                    if(code == brand.code){
                        return brand;
                    }
                }
                return null;
            }

        }
    }
)
