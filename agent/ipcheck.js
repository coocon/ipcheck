
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
        callback && callback(arrIPList, idList);
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
        idList[i] = item;
        var item = analysisRow(item); 
        var ip = item.ip;
        item._id = i;
        list[ip] = item;
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
    var arr = row.split(':');
    var ip = trim(arr[0]);
    var contents = trim(arr[2]).split(' ');
    item = handlePosition(contents); 
    item.ip = ip;
    item.isp =  useDict(arr[1]);

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

