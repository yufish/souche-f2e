define(function(){
    
    var  _view = {
        renderPopup: function(carCtn){
            // get img and fill
            // get name and fill
            // get price and fill
        }
    };

    var _event = {
        bind: function(){

        },
        bindShare: function(){

        }
    };

    function init(){
        _event.bindShare();
    }
    
    function popup(e){
        var carCtn = $(e.target).parents();
        _view.renderPopup(carCtn);
    }

    return {
        init: init,
        popup: popup
    };
})