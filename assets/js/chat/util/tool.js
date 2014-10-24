var tool = {
    isEmptyObj: function(obj){
        for(var i in obj){
            return false;
        }
        return true;
    }
};


module.exports = tool;