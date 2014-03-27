var Pet = (function() {

    var config = {
        likeApi: "#"
    }
    return {
        init: function(_config) {
            $.extend(config, _config);
            $(".like").on("click", function(e) {
                e.preventDefault();
                var id = $(this).closest(".item").attr("data-id");
                $.ajax({
                    url: config.likeApi,
                    type: "post",
                    dataType: "json",
                    data: {
                        id: id
                    },
                    success: function(data) {
                        if (data.success) {

                        } else {
                            alert(data.info)
                        }
                    }
                })
            })

        }
    }
})();