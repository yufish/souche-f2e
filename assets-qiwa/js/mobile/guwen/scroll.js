/**
 * Created by zilong on 2014/6/19.
 */
var $win = $(window);
var $sCtn = $('#series-container');
var $bCtn = $('#brand-icons-container')
var $sb = $('#selected-brand');
var $ss =$('#selected-series');
$win.scroll(function(){
    var bOffset = $bCtn.offset();
    var winTop = $win.scrollTop();

    if(bOffset.top<winTop){
        var sbHeight = $sb.height();
        $sb.css({height:sbHeight});
    }else{
        $sb.css({height:'auto'})
    }

    var sOffset = $sCtn.offset();
    var winTop = $win.scrollTop();
    if(sOffset.top<winTop){
        var sbHeight = $ss.height();
        $ss.css({height:sbHeight});
    }else{
        $ss.css({height:'auto'})
    }
})