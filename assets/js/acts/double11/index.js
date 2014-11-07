define(['acts/double11/like-share'], function(LikeShare){

    var _view = {
        init: function(){
        }
    };


    var _event = {
        bind: function(){
            $('.share-button').on('click', _event.LikeAndPop);
        },
        LikeAndPop: function(e){

            LikeShare.popup(e);
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