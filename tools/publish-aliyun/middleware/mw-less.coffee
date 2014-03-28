less = require("less")
fs = require 'fs'
path = require 'path'
module.exports = (file,callback)->
  parser = new(less.Parser)({
    paths: [path.dirname(file)],
    filename: 'style.less'
  })
  result_file = file.replace(/^(.*)\.less$/,'$1.css')
  parser.parse fs.readFileSync(file,'utf-8'),(e, css)->
    if e 
      console.error e
      callback e,{path:file,realPath:file}
    else
      fs.writeFile result_file,css.toCSS({compress: true}),(error)->
        if error then console.error error
        else
          console.log 'compile less to ' + result_file
        callback error,{path:result_file,realPath:result_file}
