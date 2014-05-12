Changefiles = new __BaseModel("f2e_changefiles")
Changefiles.sync()
func = new __BaseFunction(Changefiles)
func.updateByPath = (path,data,callback)->
    Changefiles.find
        where:
            path:path
    .success (file)->
        if file
            fields = []
            for k,v of data
              if Changefiles.rawAttributes[k]
                fields.push k
            file.updateAttributes(data,fields)
            .success ()->
              callback&&callback null,file
            .error (error)->
              callback&&callback error
        else
            callback new Error '不存在的文件'
    .error (error)->
        callback error

func.getByPath = (path,callback)->
    Changefiles.find
        where:
            path:path
    .success (file)->
        callback null,file
    .error (error)->
        callback error
module.exports = func

