var Index = (function(){
    function searchActive(){
        $('.search-box').css({display:'block'});
        $('.search-icon').css({display:'none'});
        $('.search-icon-2').css({display:'block'});
        $('#keyword').focus();
    }
    function searchHidden(){
        $('.search-box').css({display:'none'});
        $('.search-icon').css({display:'block'});
        $('.search-icon-2').css({display:'none'});
    }
    return {
        init:function(){
            $('.search-icon').click(function(e){
                searchActive();
            })
            $('.search-icon-2').click(function(e){
                searchHidden();
            });
            $('.cancel-icon').click(function(e){
                $('#keyword').val('');
                $('#keyword').focus();
            })
            $('#search-form').submit(function(e){
                if($('#keyword').val().trim()==''){
                    searchHidden();
                    e.preventDefault();
                }
            });
            $('#search-btn').click(function(e){
                if($('#keyword').val().trim()==''){
                    $('keyword').val('');
                }else{
                    $('#search-form').submit();
                }
            });

            $('.back-icon').click(function(){
                if(document.referrer.indexOf("souche")!=-1){
                    history.back();
                }else {
                    window.location.href='index.html';
                }
            })

        }
    }
})();
Index.init();