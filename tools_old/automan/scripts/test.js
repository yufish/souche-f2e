var phantom = require('phantom');


module.exports = {
    run: function(callback) {
        // 如果失败就callback(new Error("具体错误信息"))
        // 如果成功就callback();

        phantom.create(function(ph) {
            ph.createPage(function(page) {
                page.open('http://www.souche.com', function(status) {
                    var result;
                    if (status !== 'success') {
                        console.log('Network error.');
                        callback(new Error("点击收藏Network error."))
                    } else {
                        page.evaluate(function() {
                            $('.collect-box').click();
                        });
                        setTimeout(function() {
                            var p = page.evaluate(function() {
                                return $("#noreg-popup").css("display")
                            });
                            if (p == "block") {
                                callback()
                            } else {
                                callback(new Error("点击收藏弹窗没有显示出来"))
                            }
                            ph.exit();
                        }, 1000)
                    }
                });
            });
        });

    }

}