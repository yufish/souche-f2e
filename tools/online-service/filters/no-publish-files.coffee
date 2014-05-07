func_changefile = __F 'changefile'
module.exports = (req,res,next)->
    func_changefile.getAll 1,10000,{is_publish:0},"id desc",(error,files)->
        res.locals.files = files
        next()