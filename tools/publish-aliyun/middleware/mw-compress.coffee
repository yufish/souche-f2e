UglifyJS = require("uglify-js")
fse = require 'fs-extra'

module.exports = (file,callback)->
  result = UglifyJS.minify(file,{"reserved-names":'require,define'})
  if /\.min\.js/.test file
    callback null,file
    return
  result_file = file.replace(/^.*?\/assets/,config.output_path)
  console.log result_file
  fse.outputFile result_file,result.code,{flags:"w"},(error)->
    if error then console.error error
    else
      console.log 'compress js to ' + result_file
    callback error,result_file
