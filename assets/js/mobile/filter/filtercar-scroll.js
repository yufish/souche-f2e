/*
$(document).ready(function(){
    var win = $(window);
    var winH = win.height();
    var okBtnWrapper =$('.popup-btns-wrapper');
    okBtnWrapper.css({
        width:win.width()-20
    })
    win.scroll(function(){
        popupBtnPositioned();
    })
    function popupBtnPositioned(){
        var srTop = win.scrollTop();
        okBtnWrapper.css({
            top:winH +srTop -  80
        })
    }
    popupBtnPositioned();
    //window.popupBtnPositioned = popupBtnPositioned;
});
*/
function map(){
    emit(this.data.keyword,{tags:[this.data.usertag],count:1});
}

function reduce(key,values){
    var tagsFlag  = {};
    var tags = [];
    for(var i = 0;i<values.length;i++){
        var tagItem = values[i].tags;
        for(var j in tagItem){
            var flag = tagItem[j]
            if(!( flag in tagsFlag)){
                tagsFlag[flag]=true;
                tags.push(flag);
            }
        }
    }
    return {tags:tags,count:tags.length}
}

db.runCommand({
    mapReduce:'trackModel',
    map:map,
    reduce:reduce,
    out:{replace:'tempCol'},
    query:{typeid:'TYPE_WEB_PAGE_SEARCH',date:{
        '$gte':new Date("2014/06/03"),'$lte':new Date('2014/06/04')
    }}
})