define(['acts/double11/like-share'], function(LikeShare){

    var _view = {
        init: function(){
        }
    };


    var _event = {
        bind: function(){
            // $('.like-btn').on('click', LikeShare.popup);
        }
    };

    function init(){
        LikeShare.init();

        _view.init();
        _event.bind();
    }

    return {
        init: init
    };
});