/*
 * e-json
 * @file 提供E-JSON标准格式的请求与解析功能
 * @auth coocon
 */

/**
 * E-JSON标准格式的请求与解析功能
 */
define(function (require) {
    var blank = function (){};
    /**
     * 发送一个数据格式为E-JSON标准的请求
     *
     * @inner
     */
    function request(url, options) {
        var success = options.success;
        var error = options.error;
        var isAbort = options.isAbort;
        //超时
        var onTimeout = options.onTimeout || blank;
        
        
        options.success = function (xhr) {
        	if(!isAbort || (isAbort && !isAbort(xhr)) ) {
            	process(xhr, success, error);
            }
            options = null;
        };

        // 状态码异常时，触发e-json的proccess，status为请求返回的状态码
        /**
         * @param {Object} xhr 异步请求
         * @param {string} textStatus 返回的状态error  timeout ...
         */
        options.error = function (xhr, textStatus) {
        	if(!isAbort || (isAbort && !isAbort(xhr)) ) {
                if (textStatus == 'timeout') {
                    onTimeout(); 
                    return;
                }
	            process({
	                    status: (xhr.status || 99999), //当ajax failure强制走error（fail时xhr.stauts可能因未知原因为0）
	                    statusInfo: xhr.statusText,
	                    data: xhr
	                },
	                success,
	                error);
            }
            options = null;
        };

        return $.ajax(url, options);
    }

    /**
     * 解析处理E-JSON标准的数据
     *
     * @inner
     */ 
    function process(source, success, error) {
        error = error || blank;
        success = success || blank;

        var obj;
        try {
            obj = typeof source == 'string' ? $.parseJson(source) : source;
        }
        catch (e) {}
        // 不存在值或不为Object时，认为是failure状态，状态码为普通异常
        if (!obj || typeof obj != 'object') {
            error(1, obj);
            return;
        }
        // 请求状态正常
        if (!obj.status) {
            success(obj.data, obj);
        } else {
            error(obj.status, obj);
        }
    }
 
    return {        
        /**
         * 发送一个数据格式为E-JSON标准的请求
         * 
         * @public
         * @param {string} url 发送请求的url
         * @param {Object} options 发送请求的可选参数
         */
        request: request,
        
        /**
         * 通过get的方式请求E-JSON标准的数据
         * 
         * @public
         * @param {string}   url 发送请求的url
         * @param {Function} success 状态正常的处理函数，(data字段值，整体数据)
         * @param {Function} error 状态异常的处理函数，(异常状态码，整体数据)
         * @param {Function} isAbort 是否被终止的判断函数
         */
        get: function (url, success, error, isAbort, timeout, ontimeout) {
            var opt =  {
                    method      : 'get',
                    success     : success, 
                    error       : error,
                    isAbort     : isAbort
            };
            if (timeout) {
            	opt['timeout'] = timeout;
            	opt['ontimeout'] = ontimeout;
            };
            request(url, opt);
        },
        
        /**
         * 通过post的方式请求E-JSON标准的数据
         *
         * @public
         * @param {string} url         发送请求的url
         * @param {string} postData    post发送的数据
         * @param {Function} success 状态正常的处理函数，(data字段值，整体数据)
         * @param {Function} error 状态异常的处理函数，(异常状态码，整体数据)
         * @param {Function} isAbort 是否被终止的判断函数
         */
        post: function (url, postData, success, error, isAbort, timeout, ontimeout) {
            var opt =  {
                    method      : 'post', 
                    data        : postData, 
                    success     : success, 
                    error       : error,
                    isAbort     : isAbort
            };
            if (timeout) {
            	opt['timeout'] = timeout;
            	opt['onTimeout'] = ontimeout;
            };
            return request(url, opt);
        },

        /**
         * 解析处理E-JSON标准的数据
         *
         * @public
         * @param {string|Object}   source    数据对象或字符串形式
         * @param {Function}        success 状态正常的处理函数，(data字段值，整体数据)
         * @param {Function}        error 状态异常的处理函数，(异常状态码，整体数据)
         */
        process: process
    };
});
