var child_process = require('child_process');
var config = require("./../../config.js");
//启动定时任务
var P = function(filePath) {
    this.file = filePath;
}
P.prototype = {
    start: function() {
        var self = this;
        var cp = child_process.fork(this.file, [], {
            cwd: config.base_path
        }); //生成子进程，indexFile进程文件地址
        console.log('task started pid:' + cp.pid);
        cp.on('exit', function() {
            self.start();
        })

    }
}
module.exports = function(filePath) {
    var p = new P(filePath);
    p.start();
}