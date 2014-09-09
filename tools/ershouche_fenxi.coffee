
participial = (str)->
  reg = /([\u3400-\u9FFF]+)|([0-9a-zA-Z.]+)/g
  results = str.match reg
#计算两个字符串的匹配度，
matchedDegree = (str1,str2)->
  str1 = str1.replace('AT','自动').replace('MT','手动').replace('A/MT','自动').replace("迷你","mini")
  arr1 = participial str1.toLowerCase()
  arr2 = participial str2.toLowerCase()
  score = 0
  arr1.forEach (word)->
    arr2.forEach (word_2)->
      if word.indexOf(word_2) != -1 #如果包含，则加分
        score++ 
      if word_2.indexOf(word) != -1 #如果互相包含，也就是相同，加两分
        score++
  #检查年
  yearReg = /([0-9]{4}款)/
  year1 = str1.match yearReg
  year2 = str2.match yearReg
  if year1&&year2
    if year1[0]==year2[0]
      score+=6
  #检查L
  LReg = /[0-9]\.[0-9]/
  L1 = str1.match LReg
  L2 = str2.match LReg
  if L1 and L2
    if L1[0]==L2[0]
      score+=6
  return score

config = require './config.coffee'
Sequelize = require 'sequelize'
queuedo = require 'queuedo'
fs = require 'fs'
sequelize = new Sequelize(config.mysql_database, config.mysql_username, config.mysql_password,
  define:
    underscored: false
    freezeTableName: true
    charset: 'utf8'
    collate: 'utf8_general_ci'
    timestamps: false
    logging:false
  host:config.mysql_host
)
#models =
#  acts: require("./models/acts.coffee")
#Acts = sequelize.define("acts", models.acts)
#Acts.sync()

models = 
  dictionary_element: require './models/dictionary_element.json'

Element = sequelize.define "dictionary_element",models.dictionary_element
data58_model = require './auto-product.json'
data58_brand = require './auto-brand.json'
data58_series = require './auto-series.json'
# data58_years = require './ershouche_years.json'
result = {}
result_year = {}
checkModel = (ele,seriesName)->
  theLargestScore = 0
  theCloseModel = ''
  theCloseModelCode = 0
  theCloseYearCode = 0
  data58_model[seriesName].forEach (model)->
    score = matchedDegree ele.name,seriesName+":::"+model.name
    if score > theLargestScore
      theLargestScore = score
      theCloseModel = model.name
      theCloseModelCode = model.code
      # theCloseYearCode = data58_years[seriesName][model]
  #console.log 'no get it:' + theCloseModel + " for:"+seriesName+":::"+ ele.name+" score:"+theLargestScore
  if theLargestScore > 13
    #ele.updateAttributes({field20:theCloseModelCode})
    result[ele.id] = {"58code":theCloseModelCode,"localName":ele.name,"58Name":theCloseModel,"type":"model"}
    result_year[ele.id] = {"58code":theCloseYearCode,"localName":ele.name,"58Name":theCloseModel,"type":"model"}
    console.log 'get it:' +seriesName+":::"+ theCloseModel + " for:"+seriesName+":::"+ ele.name+" score:"+theLargestScore
    ele.updateAttributes({field18:theCloseModelCode})
checkBrand = (ele)->
  theLargestScore = 0
  theCloseBrand = ''
  theCloseBrandCode = 0
  data58_brand.forEach (brand)->
    score = matchedDegree ele.name,brand.name
    if score > theLargestScore
      theLargestScore = score
      theCloseBrand = brand.name
      theCloseBrandCode = brand.id
  #
  if theLargestScore > 0
    result[ele.id] = {"58code":theCloseBrandCode,"localName":ele.name,"58Name":theCloseBrand,"type":"brand"}
    console.log 'get it:'+theCloseBrand+" for:"+ele.name+" score:"+theLargestScore
    newBrands[ele.code] = theCloseBrand
  else
    ele.updateAttributes({field18:theCloseBrandCode})

checkSeries = (ele,brandName)->
  theLargestScore = 0
  theCloseSeries = ''
  theCloseSeriesCode = 0
  data58_series[brandName].forEach (series)->
    score = matchedDegree ele.name,series.name
    if score > theLargestScore
      theLargestScore = score
      theCloseSeries = series.name
      theCloseSeriesCode = series.id
  if theLargestScore > 0
    #ele.updateAttributes({field20:theCloseSeriesCode})
    result[ele.id] = {"58code":theCloseSeriesCode,"localName":ele.name,"58Name":theCloseSeries,"type":"series"}
    console.log 'get it:'+theCloseSeries+" for:"+brandName+":::"+ele.name+" score:"+theLargestScore
    newSeries[ele.code] = theCloseSeries
  else
    ele.updateAttributes({field18:theCloseSeriesCode})
runBrand = (callback)->
  Element.findAll
    offset: 0
    limit: 100000
    where:
      level:"brand"
  .success (eles)->
    eles.forEach (ele)->
      if ele.level == "brand"
        
        checkBrand ele
      else if ele.level == "series"
        checkSeries ele
      else if ele.level == "model"
        console.log 'model'
        #checkModel ele
    callback()
  .error (error)->
    throw error
    callback(error)
    
runSeries = (brandId,brandName,callback)->
  Element.findAll
    offset: 0
    limit: 1000000
    where:
      level:"series"
      parent:brandId
  .success (eles)->
    eles.forEach (ele)->
      checkSeries ele,brandName
    callback()  
  .error (error)->
    callback(error)

runModel = (seriesId,seriesName,callback)->
  Element.findAll
    offset: 0
    limit: 1000000
    where:
      level:"model"
      parent:seriesId
  .success (eles)->

    eles.forEach (ele)->
      checkModel ele,seriesName
    callback()  
  .error (error)->
    callback(error)
  
 
#run
#runSeries()
newBrands = {}
newSeries = {}
runBrand (error)-> #先跑brand并获取到brand-code对应的品牌名
  console.log 'end brand'
  if not error
    console.log newBrands
  newBrandsArr = []
  fs.writeFileSync 'che_newBrands.json',JSON.stringify(newBrands,null,2)
  for nb of newBrands
    newBrandsArr.push({code:nb,name:newBrands[nb]})
  queuedo newBrandsArr,(item,next,context)->
    runSeries item.code,item.name,()->
      next.call(context)
  ,()->
    console.log 'end series'
    newSeriesArr = []
    fs.writeFileSync 'che_newSeries.json',JSON.stringify(newSeries,null,2)
    for nb2 of newSeries
      newSeriesArr.push({code:nb2,name:newSeries[nb2]})
    console.log newSeriesArr
    queuedo newSeriesArr,(item,next,context)->
      runModel item.code,item.name,()->
        next.call(context)
    ,()->
      console.log 'end model'
      fs.writeFileSync 'che_58_result.json',JSON.stringify(result,null,2)
    #   fs.writeFileSync 'che_year.json',JSON.stringify(result_year,null,2)

