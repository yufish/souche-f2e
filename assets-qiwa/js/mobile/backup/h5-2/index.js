define([], function(){
  var PageSlider = function(jqObjs){
    var pages = jqObjs;
    var total = pages.length;
    var curPageIndex = 0;
    function initCSS(){
       pages.css({
          width:'100%',
          position:'absolute',
          left:'100%',
          display:none,
          top:0
        })
        jqObj.parent().css({
          position:'relative'
        })
        pages.eq(0).css({
          left:'0',
          display:'block'
        })
    }
    return{
      config:{
        autoMove:false,
        timeSpan:1000
      },
      init:function(_config){
        $.extend(this.config,_config);
        var self =this;
        if(this.config.autoMove){
          setInterval(function(){
            self.nextPage();
          },timeSpan);
        }
        initCSS();
      },
      nextPage:function(pageIndex){
        pageIndex = pageIndex || curPageIndex+1;
        if(pageIndex==total){
          pageIndex=0;
        }
        var $curPage = pages.eq(curPageIndex)
            ,$page = pages.eq(pageIndex);
        $page.css({left:'100%'}).show();
        $curPage.animate({left:'-100%'},function() {
          $curPage.hide();
        })
        $page.animate({left:'0'});
        curPageIndex = pageIndex;
      }
    }
  }
})

