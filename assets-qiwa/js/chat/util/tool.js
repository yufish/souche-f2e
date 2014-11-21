var tool = {
    isEmptyObj: function(obj){
        for(var i in obj){
            return false;
        }
        return true;
    },
    makeDouble: function(n){
        if(n>=10){
            return n;
        }
        else{
            return '0'+n;
        }
    }
};


module.exports = tool;