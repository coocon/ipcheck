
var ipcheck = require('./ipcheck');
var iptool = require('./iptool');
var fs = require('fs');

var mysql = require('mysql');
var tryTimes = 3;
var config = require('../config');


var SLEEP_TIME = 500;
var conn = null;
var TIME_OUT = 10000;

var conn = {};

function connect(success, fail) {
    conn = mysql.createConnection(config.mysql);
    conn.connect(function(err) {

        if (err) {
            console.error('error connecting: ' + err.stack);
            fail && fail(err);
            return;
        }
        success && success(conn);
    });
}
function isConnected() {
    var result = false;
    if (conn.state == 'authenticated') {
        result = true; 
    }
    return result;
}

function getData(callback) {
    var tbname = config.tableName; 
    if (isConnected()) {
        var sql = 'select * from ' + tbname;
     //   var sql = 'if not exists( select * from tb_ipcheck_v2 where ip = ?)' 
      //      + ' begin insert into tb_ipcheck_v2 set ip = ?,sina= ?, taobao = ?, 17mon=?,51cache=?  end '
        var params= [];  
        sql = mysql.format(sql, params);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('error in db:', err); 
            }
            else {
                callback && callback(result);
            }
        });
        return;
    }
    connect(function () {
        getData(callback); 
    }, function () {
    });
}

/**
 * 关闭数据库连接
 */
function closeConnection() {
    conn.end();
}

function filterCity(_51cache) {
    var result = false;
    if (_51cache.province == '河南' && _51cache.city == '郑州') {
        //result = true; 
    }

    return result;
}

/**
 * 跟17mon比较 ，如果不同就推送出来
 */
function checkData(item) {
    var result = true;
    var _51cache = item['51cache'];
    var _17mon = item['17mon'];
    var all = _17mon.all;
    //删除一些 需要提出的内容
    if (filterCity(_51cache)) {
        return result; 
    } 

    if (_51cache.isp != _17mon.isp) {
        
        if (_51cache.isp == 'BGP' && (_17mon.isp != '联通' && _17mon.isp != '电信')) {
            result = true; 
        }
        else {
            result = false; 
        }
    }
    
    if (all.indexOf(_51cache.province) == -1) {
        result = false;
        
    }
    if (all.indexOf(_51cache.country) == -1) {
        result = false;
    }
    if (!result) {
    //     console.log(item); 
    }
    return result;

}


function tryParse(item, strs) {
    try {
        //{a:100,b:333,c:sss   没有括号
        item[strs] = JSON.parse(item[strs]);
    }catch(ex) {
        var str = item[strs];
        var arr = str.split(',');
        arr = arr.slice(0, arr.length - 1);
        str = arr.join(',') + '}';
        console.log('expect:', str);
        item[strs] = JSON.parse(str);
    } 
    return item;
}

/**
 * @param {Object}  params 
 * @param {Function} callback 
 */
function getDiffData(params, callback) {

    //拿到数据
    getData(function (data) {
        var len = data.length;
        var diffList = [];
        console.log(data[5169]);
        for (var i = 0; i < len; i++) {
            var item = data[i]; 

            console.log(i);
            //坑爹，我把字段设置100 小了
                //{a:100,b:333,c:sss   没有括号
            tryParse(item, '51cache');
            tryParse(item, '17mon');
            tryParse(item, 'taobao');
            tryParse(item, 'sina');
            var result = checkData(item);
            if (!result) {
                diffList.push(item); 
            }
        }

        closeConnection();
        callback && callback(diffList, len);

    });

}
module.exports = {
    getDiffData: getDiffData 
};
