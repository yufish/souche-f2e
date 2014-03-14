UglifyJS = require("uglify-js")
fs = require 'fs'
module.exports = (file,callback)->
  result = UglifyJS.minify(file)
  if file.
  result_file = file.replace(/^(.*)\.js$/,'$1.min.js')
  fs.writeFile result_file,'utf-8',(error)->
    callback error,result_file
