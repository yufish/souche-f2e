module.exports = 
  randomItem:(arr)->
    l = arr.length
    return arr[Math.floor(Math.random()*l)]