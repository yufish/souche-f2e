var fs = require("fs")
fs.watchFile('./temp', function(curr, prev) {
    console.log('the current mtime is: ' + curr.mtime);
    console.log('the previous mtime was: ' + prev.mtime);
});