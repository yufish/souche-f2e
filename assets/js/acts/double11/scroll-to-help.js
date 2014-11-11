// scroll to help click
(function(){
    function getElAndScroll(){
        var helpGetEl = $('.help-getcar');
        if( helpGetEl.length > 0 ){
            // console.log('gonna scroll');
            var top = helpGetEl.offset().top;
            // 微调数据
            document.body.scrollTop = top - 40;
        }
        else{
            setTimeout(getElAndScroll, 100);
        }
    }

    getElAndScroll();
})();