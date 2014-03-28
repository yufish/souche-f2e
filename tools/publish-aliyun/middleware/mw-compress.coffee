UglifyJS = require("uglify-js")
fse = require 'fs-extra'

module.exports = (file,callback)->
  try 
    result = UglifyJS.minify(file,{"reserved-names":'require,define'})
  catch e
    callback null,{path:file,realPath:file}
    return
  
  if /\.min\.js/.test file
    callback null,{path:file,realPath:file}
    return
  result_file = file.replace(/^.*?\/assets/,config.output_path)
  fse.outputFile result_file,result.code,{flags:"w"},(error)->
    if error then console.error error
    else
      console.log 'compress js to ' + result_file
    callback error,{path:file,realPath:result_file}
