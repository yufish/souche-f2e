var CoffeeScript = require('coffee-script');
CoffeeScript.register();
require('./../lib/modelLoader.coffee')
require('./../lib/functionLoader.coffee')
var moment = require("moment")
var data = process.argv[2].split(";;;")
var func_change = __F('changefile')
if (/^assets/.test(data[3])) {
    func_change.getByPath(data[3], function(error, path) {
        if (!path)
            func_change.add({
                path: data[3],
                is_publish: 0,
                commiter: data[0],
                commit_time: moment(data[1]).toDate(),
                log: data[2]
            })
    })

}