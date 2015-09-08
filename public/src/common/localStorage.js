/**
 * @file: html5的localStorage
 * 目前不支持低版本浏览器 
 * 理论来说本地存储应该处理一下key
 * @author coocon2007@gmail.com
 */

define(function (require) {

    var blank = function () {};

    var ls = null;
    //根据key判断是否是对象
    //相应的 转码和解码
    var objDict = {};

    function init() {
        ls = localStorage || {
            setItem: blank,
            getItem: blank,
            clear: blank,
            removeItem: blank
        }; 
    }

    /**
     * 处理一下key，防止跟别的storage冲突
     */
    function handleKey(key) {
        key = 'fx_' + key;  
        return key;
    }

    //设置存储内容
    function setItem(key, value) {
        key = handleKey(key);
        var val = value;
        var type = typeof value;
        //简单判断吧 object就转化一下
        if (type == 'object') {
            val = JSON.stringify(value); 
            objDict[key] = type;  
        }

        ls.setItem(key, val);
    }
 
    function getItem(key) {
    
        key = handleKey(key);
        var value = ls.getItem(key);

        if (objDict[key]) {
            value =  JSON.parse(value); 
        }
        //判断是否位json
        return  value;

    }

    function removeItem(key) {
        key = handleKey(key);
        var result = ls.removeItem(key);
        return result;
    }
    /**
     * del localstorage
     */
    function clear() {
        ls.clear(); 
    }

    //初始化
    init();

    return {
        getItem: getItem,
        setItem: setItem,
        clear: clear,
        removeItem: removeItem
    };

});
