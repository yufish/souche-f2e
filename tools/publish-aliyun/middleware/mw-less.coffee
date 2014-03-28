less = require("less")
fs = require 'fs'
module.exports = (file,callback)->
  result_file = file.replace(/^(.*)\.less$/,'$1.css')
  less.render fs.readFileSync(file,'utf-8'),(e, css)->
    fs.writeFile result_file,css,(error)->
      if error then console.error error
      else
        console.log 'compile less to ' + result_file
      callback error,{path:result_file,realPath:result_file}
