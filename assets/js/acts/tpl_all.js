var Act = function () {
    var pageIndex = 2;
    return {

        init: function (loadMoreUrl) {
            $.ajax({
                url: loadMoreUrl,
                data: {
                    index: (pageIndex++)
                },
                success: function (data) {
                    console.log(data);
                }
            })
        }
    }
}();