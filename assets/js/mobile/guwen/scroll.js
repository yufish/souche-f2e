/**
 * Created by zilong on 2014/6/19.
 */
var $win = $(window);
var $sCtn = $('#series-container');
var $bCtn = $('#brand-icons-container')
var $sb = $('#selected-brand');
var $ss =$('#selected-series');
$win.scroll(function(){
    var offset = $bCtn.offset();
    var winTop = $win.scrollTop();
    if(offset.top<winTop){
        var sbHeight = $sb.height();
        $sb.css({height:sbHeight});
    }else{
        $sb.css({height:'auto'})
    }
})