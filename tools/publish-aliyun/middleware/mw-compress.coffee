UglifyJS = require("uglify-js")
fs = require 'fs'
module.exports = (file,callback)->
  result = UglifyJS.minify(file)
  if /\.min\.js/.test file
    callback null,file
    return
  result_file = file.replace(/^(.*)\.js$/,'$1.min.js')
  fs.writeFile result_file,result.code,(error)->
    callback error,result_file
