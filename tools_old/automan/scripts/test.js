var STF = require("./../STF.js");
var stf = new STF("收藏的测试");


module.exports = {
    run: function(callback) {
        stf
            .open("http://www.souche.com")
            .run(function() {
                $('.collect-box').click();
            })
            .wait(1000)
            .check(function() {
                return new Error("第一个错误")
            })
            .check(function() {
                return new Error("第二个错误")
            })
            .done(function(errors) {
                callback(errors)
            })
    }
}