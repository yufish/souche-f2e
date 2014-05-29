#npm install --save optimage
path = require("path")
fs = require("fs")
module.exports = (file,callback)->
    exec = require('child_process').exec
    data = eval(fs.readFileSync(file,'utf-8'))
    dirname = path.dirname file
    filename = path.basename file
    console.log data
    child = exec ('cd '+dirname+';r.js -o '+filename),(error, stdout, stderr) ->
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if error != null
          console.log('exec error: ' + error);
        callback error,{path:(path.join dirname,data.out),realPath:(path.join dirname,data.out)}