/**
 * Created by zilong on 2014/7/23.
 */
var phantom = require('phantom');


module.exports = {
    run: function(callback) {
        // 如果失败就callback(new Error("具体错误信息"))
        // 如果成功就callback();

        //可能需要更新carId
        var url = 'http://www.souche.com/pages/choosecarpage/choose-car-detail.html?carId=L0qeo87';
        phantom.create(function(ph) {
            ph.createPage(function(page) {
                page.open(url, function(status) {
                    var result;
                    if (status !== 'success') {
                        console.log('Network error.');
                        callback(new Error("点击预约Network error."))
                    } else {
                        page.evaluate(function() {
                            $('.detail-yuyue').click();
                        });
                        setTimeout(function() {
                            var p = page.evaluate(function() {
                                return $("#yuyue-popup").hasClass("hidden");
                            });
                            console.log(p)
                            if (!p) {
                                callback()
                            } else {
                                callback(new Error("预约窗口未弹窗"))
                            }
                            ph.exit();
                        }, 1000)
                    }
                });
            });
        });

    }

}