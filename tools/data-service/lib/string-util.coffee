module.exports = 
  cutByte:(str, num) ->
    len = 0
    i = 0
    newStr = str
    while i < str.length
      if str[i].match(/[^\x00-\xff]/g)? #全角
        len += 2
      else
        len += 1
      i++
      newStr = str.substring(0, num) + "…"  if len >= num
    newStr
  cutByteAgainst:(str, num) ->
    len = 0
    i = 0
    newStr = str
    while i < str.length
      if str[i].match(/[^\x00-\xff]/g)? #全角
        len += 1
      else
        len += 2
      i++
      newStr = str.substring(0, num) + "…"  if len >= num
    newStr
  cut:(str, num)->
    if str.length > num
      return str.substr(0,num)+"..."
    else
      return str