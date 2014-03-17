#npm install --save optimage
optimage = require("optimage")
fs = require 'fs'
module.exports = (file,callback)->
  optimage
    inputFile: file,
    outputFile: file
  ,(err,res)->
    if err
      console.error err
    callback err,file