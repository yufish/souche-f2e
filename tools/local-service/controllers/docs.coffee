
module.exports.controllers = 
    "/":
        get:(req,res,next)->
            res.render 'docs/index.jade'