/**
 * Created by zilong on 2014/5/21.
 */
 function()
 {
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

        var BrandMgr ={
            brands :[],
            ltns :[],
            addLtn :function(ltn){
                this.ltns.push(ltn);
            },
            notify:function(){
                for(var i =0;i<this.ltns.length;i++){
                    this.ltns[i].process(this.brands);
                }
            },
            addBrand:function(code,name,series){
                var b = new Brand(code ,name,series);
                this.brands.push(b);
                this.notify({
                    eventType:'addBrand',
                    newItem:b
                });
            },
            addSeries:function(code,name,bCode){
                if(!bCode)throw new TypeError('bCode should be non empty string');
                var brand = this._getBrandByCode(bCode);
                if(brand==null)throw new TypeError('cannot get brand by the given code');
                brand.addSeries(new Series(code ,name));
            },
            delBrand:function(code){
                for(var  i = 0;i<this.brands.lengtth;i++){
                    if(code==this.brands[i].code){
                        var dItem = this.brands.splice(i,1);
                        this.notify({
                            eventType:'delBrand',
                            delItem:dItem
                        })
                    }
                }
            },
            delSeries:function(code,bCode){
                if(!bCode)throw new TypeError('bCode should be non empty string');
                var brand = this._getBrandByCode(bCode);
                if(brand==null)throw new TypeError('cannot get brand by the given code');
                var series = brand.series;
                for(var i = 0;i<series.length;i++){
                    if(code == series[i]){
                        var dItem = series.splice(i,1);
                        this.notify({
                            eventType:'delSeries',
                            brand:brand,
                            delItem:dItem
                        })
                    }
                }
            },
            _getBrandByCode:function(code){
                for(var i = 0;i<this.brands.length;i++){
                    var brand = this.brands[i]
                    if(bCode == brand.code){
                        return brand;
                    }
                }
                return null;
            }

        }
}