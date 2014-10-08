// new-list-nav.js
define(function(){

    var carListWrap = $('.car-wrap');

    var _event = {
        bind: function(){
            $('.view-switch').on('click', '.view-item', _event.listViewSiwtch);
        },
        listViewSiwtch: function(){
            var viewItem = $(this);
            if( viewItem.hasClass('active') ){
                return false;
            }
            else{
                carListWrap.removeClass('card-box list-box');
                viewItem.addClass('active').siblings('.view-item').removeClass('active');
                
                if( viewItem.hasClass('list') ){
                    carListWrap.addClass('list-box');
                }
                else{
                    carListWrap.addClass('card-box');
                }
            }
        }
    }

    function init(){
        // 
        _event.bind();
    }

    return {init: init};
});