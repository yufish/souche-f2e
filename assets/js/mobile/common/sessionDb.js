/**
 * Created by zilong on 2014/8/12.
 */
var toString = Object.prototype.toString;
function iaArray(t){
    return toString.call(t)==="[object Array]";
}
var sessionDb = function(){

}
/*meta:
    limit:保留数据的个数上限
    timeOut:超时时间*/
var DbObject = function(value,meta){
    this.db = Window.sessionStorage;
}
//key:string;value:must be array
sessionDb.prototype={
    constructor:sessionDb,
    setItem:function(key,value){
        if(!isArray(value)){
            throw new Error('setItem的value必须为数组');
        }
        //try{
            this.db.setItem(key,JSON.stringify(value));
        //}catch(e){}
    },
    getItem:function(key){
        var value = this.db.getItem(key);
        var valueArr = JSON.parse(value);
        if(!isArray(valueArr)){
            valueArr = [value];
        }
    }
}