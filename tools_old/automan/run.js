var scripts = [
    "./scripts/test.js"
];


var queuedo = require("queuedo");

queuedo(scripts, function(script, next, context) {
    require(script).run(function(errors) {
        if (errors.length) {
            console.log(errors);
        } else {
            console.log(script + " 通过测试");
        }
        next.call(context);
    })
});