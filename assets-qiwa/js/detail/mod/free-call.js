define(function(){

    var config = {};

   var submiFreeCall = function() {
        $.ajax({
            url: contextPath + "/pages/telephoneAction/freecall.json",
            data: {
                phone: $.trim($("#free-phoe").val()),
                // userCellphone: "18667932551",
                carId: config.carId,
                time: config.timeStamp,
                token: config.token, // get from pagetime=1402679812551&token=3fef20ec1692c27590a4e924a9d5c6aa
                from: "web"
            },
            type: "get",

            success: function(data) {
                $("#free-popup").addClass("hidden");
                $("#free-popup-result").removeClass("hidden");
                $(".calling").text($("#free-phoe").val());
            }
        })
    }

    

    var _event = {
        bind: function(){
            $("#J_freeCall").on("click", function() {
                $("#free-popup").removeClass("hidden");
            });
            $("#free-popup").find("#freecall-form").on("submit", function(e) {
                e.preventDefault();
                if ( !phoneReg.test( $.trim($("#free-phoe").val()) ) ) {
                    $(".warning", this).removeClass("hidden");
                } else {
                    submiFreeCall();
                }
            });
            $("#free-popup-result").find(".change-number").on("click", function() {
                $("#free-popup").removeClass("hidden");
                $("#free-popup-result").addClass("hidden");
            });
        }
    };

    function init(_config){
        $.extend(config, _config);
        _event.bind();
    }

    return {
        init: init
    };

});