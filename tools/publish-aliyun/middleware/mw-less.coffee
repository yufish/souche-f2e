less = require("less")
fs = require 'fs'
module.exports = (file,callback)->
  result_file = file.replace(/^(.*)\.less$/,'$1.css')
  less.render fs.readFileSync(file,'utf-8'),(e, css)->
    fs.writeFile result_file,css,(error)->
      callback error,result_file
