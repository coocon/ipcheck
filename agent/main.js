
var ipcheck = require('./ipcheck_v2');
var iptool = require('./iptool');
var fs = require('fs');
//var PATH_IPLIST = '../data/ip.list';
var PATH_IPLIST = require('../config').PATH.IP_LIST;

var mysql = require('mysql');
// 最大同时5个并发
var REQUEST_MAX_NUM = 2;

var PER_CHECK_TIME = 500;

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

function sleep(time) {
    var t1 = new Date().getTime();
    while(true) {
        var t2 = new Date().getTime();
        if ((t2 - t1) > time) {
            break;
        }
    }
}

var connTimer = null;
function closeConnection() {
    if (connTimer) {
        clearTimeout(connTimer);    
        connTimer = null; 
    }
    connTimer = setTimeout(function () {
        conn.end();
    }, 5000);    

}

function isConnected() {
    var result = false;
    if (conn.state == 'authenticated') {
        result = true; 
    }
    return result;
}


function saveData(ip, data) {
    var tbname = config.tableName; 
    if (isConnected()) {
        var sql = 'insert into ' + tbname + ' set ip = ?,sina= ?, taobao = ?, 17mon=?, 51cache=?  ';
      //  var sql = ' insert into tb_ipcheck_v2 ( ip, sina,taobao,17mon,51cache) values (?,?, ?, ,?) '
       //         + ' if not exists (select * from tb_ipcheck_v2 where ip = ?) ' 
        var params= [
            ip, 
            JSON.stringify(data.sina),
            JSON.stringify(data.taobao),
            JSON.stringify(data['17mon']),
            JSON.stringify(data['51cache'])
        ];  
        sql = mysql.format(sql, params);
        conn.query(sql, function (err, result) {
            if (err) {
                console.log('error in db:', ip, err); 
            }
            else {
                console.log('ok:', ip);
                closeConnection();
            }
            
        });
        return;
    }
    connect(function () {
        
        saveData(ip, data); 
    }, function () {
    });

}




var itemDoingList = [];
var i = 0;
function checkDoing(ipList) {
    
    if (itemDoingList.length <= REQUEST_MAX_NUM) {
        var item = ipList[i]; 
        if(!item) {
            //clear check timer
            clearInterval(checkTimer); 
            return;
        }
        (function(item){
            i += 1;
            itemDoingList.push(item);
            iptool.getItemInfo(item.ip, function (obj) {
                itemDoingList.pop();
                obj['51cache'] = item; 
                saveData(item.ip, obj);  
            });
        })(item);
    }
    return;
  
}

var checkTimer = null;

ipcheck.getIPList(function (ipList) {
    var len = ipList.length;
    console.log('total ipList:', len);
    checkTimer = setInterval( function () { 
        checkDoing(ipList); 
    }, PER_CHECK_TIME);
});

