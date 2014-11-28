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
        Brand.NoLimit = new Brand('','不限');
        var Series = function(code,name){
            this.name = name;
            this.code = code;
        }
        Series.NoLimit = new Series('','不限')

        //var BrandMgr =
        return {
            brands :[],
            ltns :[],
            //pres:[],
            //前置检查，如果不满足要求，不在执行后面的通知
//            addPre:function(pre){
//              this.pres.push(pre);
//            },
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
                    item:b,
                    bLen:this.brands.length
                });
            },
            noLimitBrand:function(){
                this.brands = [];
                //this.brands.push(Brand.NoLimit);
                this.notify({
                    eventType:'noLimitBrand'
                    //item:Brand.NoLimit
                })
            },
            isBrandNoLimit:function(){
                return (this.brands.length==0);
            },
            addSeries:function(code,name,bCode){
                var brand = this._checkBrand(bCode);
                var s = new Series(code ,name)
                brand.addSeries(s);
                this.notify({
                    eventType:'addSeries',
                    item:s,
                    brandCode:bCode
                })
            },
            noLimitSeries:function(bCode){
                var brand = this._checkBrand(bCode);
                brand.series = [];
                this.notify({
                    eventType:'noLimitSeries',
                    brandCode:bCode
                })
            },
            removeBrand:function(code){
                for(var i = 0;i<this.brands.length;i++){
                    if(code==this.brands[i].code){
                        var dItem = this.brands.splice(i,1)[0];
                        this.notify({
                            eventType:'removeBrand',
                            item:dItem,
                            bLen:this.brands.length
                        })
                        return;
                    }
                }
            },
            removeSeries:function(code,bCode){
                var brand = this._checkBrand(bCode);
                var series = brand.series;
                for(var i = 0;i<series.length;i++){
                    if(code == series[i].code){
                        var dItem = series.splice(i,1)[0];
                        this.notify({
                            eventType:'removeSeries',
                            brandCode:bCode,
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
            },
            _checkBrand:function(bCode){
                if(!bCode)throw new TypeError('bCode should be non empty string');
                var brand = this._getBrandByCode(bCode);
                if(brand==null)throw new TypeError('cannot get brand by the given code');
                return brand;
            }
//            _preCheck:function(){
//                for(var i=0;i<this.pres.length;i++){
//                    if(!this.pres[i].check(eData)){
//                        return false;
//                    }
//                }
//                return true;
//            }
        }
    }
)
