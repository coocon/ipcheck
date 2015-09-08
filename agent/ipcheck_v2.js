
/**
 * 获取ip列表
 */
var PATH = require('../config').PATH.IP_LIST;
var fs = require('fs');
var dict = require('./dict');
//ip:运营商:position
//222.221.0.12:TEL Kunming Yunnan China 
//ip: obj
var objIPList = {};
var arrIPList = [];

var idList = {};

function getIPList(callback) {
    
    fs.readFile(PATH, {
        encoding: 'utf8' 
    }, function (err, data) {
        if (err) {
            console.log('err in read file');
            return;
        }
        var rows = data.split('\n'); 
        arrIPList = analysisRows(rows); 
        callback && callback(arrIPList);
    });
}

function useDict(str) {
    var res = str;

    if (dict.en[str]) {
        res = dict.en[str];
    }

    return res;
}
function handlePosition(arr) {
    var item = {
        country: null,
        province: null,
        city: null
    };
    //可以认为没有desc这个字段
    var dict = [
        'country' ,
        'province',
        'city',
        'desc'
    ]; 
    var len = arr.length;
    var list = arr.reverse(); 

    for (var i = 0; i < len; i++) {
        var str = dict[i];
        item[str] = useDict(list[i]) 
    } 

    return item;
}


/**
 * rows
 */
function analysisRows(items) {
    var  list = {};
    var arr = [];
    //先用字典去重
    for (var i = 0, item; item = items[i]; i++) {
        var item1 = analysisRow(item); 
        var item2 = analysisRow(item); 
        var ip = item1.ip;
        var ip2 = item2.ip2;
        item2.ip = ip2;
        item1._id = i * 2;
        item2._id = i * 2 + 1;
        list[ip] = item1;
        list[ip2] = item2;
    }

    for (var name in list) {
        arr.push(list[name]); 
    }
    return  arr;
}
/**
 * 根据每行的数据来获取ip的运营商
 * {ip:222,isp:''}
 */
function analysisRow(row) {
    try{
    row = trim(row);
    //ip:isp:position
    //ip:ip:position
    var arr = row.split(' ');
    var ip = trim(arr[0]);
    var ip2 = trim(arr[1]);
    var contents = arr.slice(2);
    item = handlePosition(contents); 
    item.isp =  useDict(arr[3]);
    item.ip = ip;
    item.ip2 = ip2;

    return item;

    }catch(ex) {
        return {}; 
    }
}



/**
* 常用的工具函数---------------------------
*/


function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}


module.exports = {
    getIPList: getIPList
};

