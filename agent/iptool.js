/**
 * 获取ip列表
 */

var http = require('http');
var HOST = 'www.ipip.net';
var URL_CHECK = '/ip.php?a=ajax';
var URL_CHECK_MON = '/ip.php';



var option = {
    hostname: HOST,
    port: 80,
    path: URL_CHECK,
    headers: {
        'Referer': 'http://www.ipip.net/ip.php',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://www.ipip.net',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    },
    method: 'POST'
};

var optionMon = {
    hostname: HOST,
    port: 80,
    path: URL_CHECK_MON,
    headers: {
        'Referer': 'http://www.ipip.net/ip.php',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://www.ipip.net',
        'Referer': 'http://www.ipip.net/ip.php',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    },
    method: 'POST'
};


function request(type, ip, option, callback) {
    var str = 'type=' + type + '&ip=' + ip;
    var req = http.request(option, function (res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            callback && callback(body); 
        });
    });

    req.write(str);

    req.on('error', function(e) {
        console.log('http error: ', e);
        callback && callback(''); 
    });

    req.end(); 
}


/**
 * 库的列表
 */
var libList = [
    'taobao', 'sina', '17mon'
];

var callbackList = {
    taobao: function (str) {
        var obj = {};
        var data = {};
        try {
            obj = JSON.parse(str);
            if (obj.state == 0) {
                data = obj && obj.data.data;
            }
            else {
                console.log('getIP tao error:', obj.error);
            }
        } catch(ex){console.log(ex); data = {}}
        try{
            return {
                country: data.country,
                province: data.region,
                city: data.city,
                isp: data.isp
            }
        }catch(ex) {
            console.log(ex);
            return {} 
        }
    },
    sina: function (str) {
        var obj;
        var data = {};
        try {
            obj = JSON.parse(str);
            if (obj.state == 0) {
                data = obj && obj.data.data;
            }
            else {
                console.log('getIP  sina error:', obj.error);
            }
        } catch(ex){}
        return {
            country: data.country,
            province: data.province,
            city: data.city,
            isp: data.isp
        }
    },
    tencent: function (str) {
    
    },
    //直接是obj
    '17mon': function (_str) {
        _str = _str || '';
        var str = _str.replace(/(\n+)|(\r+)/g, '');
        var data = {}; 
        str = str.match(/<span\s+id="myself">(.+)<\/span>/) || '';
        if (str) {
            var str = str && str[1];
            str = trim(str);
            //str = '中国河北石家庄  联通'
            var arr = str.split(/^(.+)\s+(.+)$/);
            var country = arr[1] || '';
            var isp = arr[2] || '';
        }

        return {
            all: str,
            country: country,
            province: '',
            city: '',
            isp: isp
        }
    }

};

/**
 * getItem 
 * @param {string} ip 
 * @param {Function} callback 成功函数 
 */
function getItemInfo(ip, callback) {
    var cnt = libList.length; 
    var obj = {};
    var now = 0;
    var opt = option;
    var timer = null;
    for (var i = 0; i < cnt; i++) {
        var item = libList[i];
        (function (item, ip, obj, i) {
            if (item == '17mon') {
                opt = optionMon;
            }
            request(item, ip, opt, function (data) {
                now += 1;
                var info = callbackList[item](data);
                obj[item] = info;
                if (!timer) {
                    timer = setTimeout(function () {
                        callback && callback(obj);
                    }, 8000); 
                }
                if (now == cnt) {
                    clearTimeout(timer);
                    timer = null;
                    callback && callback(obj);
                }
            })
        })(item, ip, obj, i);
    } 
}


/**
 * 常用的工具函数---------------------------
 */


function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}



module.exports = {
    getItemInfo: getItemInfo
};

