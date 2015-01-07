/**
 * 一个本地存储的类，带有错误处理，在ie不会抛错，只会存储失败
 *
 * @return {[type]} [description]
 */
define(function() {

    var SCDB = function(_namespace) {
            this.namespace = (_namespace || 'souche') + "_";
        }
        // if (typeof(localStorage) == "undefined") {
        //     alert(typeof(localStorage))
        //     var localStorage = {
        //         getItem: function() {
        //             return "";
        //         },
        //         setItem: function() {

    //         }
    //     }
    // }
    var util = {
        /**
         * 将任何值转换为数组，如果已经是直接返回。
         */
        valueToArray: function(value) {
            if (value == null) {
                return [];
            } else if (value.splice && value.length) {
                return value;
            } else {
                return [value];
            }
        }
    }
    SCDB.prototype = {
        /**
         * [get description]
         * @param  {[type]} key  [description]
         * @param  {[type]} time [缓存时间，超过此时间，返回空]
         * @return {[type]}      [description]
         */
        get: function(key, time) {
            key = this.namespace + key;
            var value = localStorage.getItem(key);
            try{
                var _data = JSON.parse(value);
                value = _data.data;
                var lastTime = _data.time;
                if (time && ((new Date()).getTime() - lastTime > time)) {
                    return null;
                }
                if (!value.length) {
                    value = null;
                    return value;
                }
                return value[0];
            }catch(e){
                return null;
            }

        },
        set: function(key, value) {
            key = this.namespace + key;
            value = util.valueToArray(value);
            try {
                localStorage.setItem(key, JSON.stringify({
                    time: new Date().getTime(),
                    data: value
                }));
            } catch (e) {

            }

        },
        gets: function(key, time) {
            key = this.namespace + key;
            var value = localStorage.getItem(key);
            var _data = JSON.parse(value);

            value = _data.data;
            var lastTime = _data.time;
            if (time && ((new Date()).getTime() - lastTime > time)) {
                return null;
            }
            return value;
        },
        sets: function(key, value) {
            key = this.namespace + key;
            value = util.valueToArray(value);
            try {
                localStorage.setItem(key, JSON.stringify({
                    time: new Date().getTime(),
                    data: value
                }));
            } catch (e) {

            }
        },
        add: function(key, value) {
            var values = this.gets(key);
            var value = util.valueToArray(value);
            if (values) {
                values = values.concat(value);
            } else if (value) {
                values = value;
            }
            this.sets(key, values);
        },
        del: function(key) {
            key = this.namespace + key;
            localStorage.setItem(key, '');
        }
    }
    return SCDB;
});