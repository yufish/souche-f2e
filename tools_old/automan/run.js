var scripts = [
    "./scripts/test.js",
    "./script/choose-car-detail/yuyue.js"
];


var queuedo = require("queuedo");

queuedo(scripts, function(script, next, context) {
    require(script).run(function(error) {
        if (error) {
            console.log(error);
        } else {
            console.log(script + " 通过测试");
        }
        next.call(context);
    })
});