
/**
 * 获取ip列表
 */

var config = require('./config');

var PATH = config.PATH.IP_EN;//'../data/ipv2-20140701-95606.txt';
var PATH_ZH = config.PATH.IP_ZH;//'../data/ipv2-20140701-95606-zh.txt';
var PATH_DICT = config.PATH.DICT;//'../data/dict.js';

var fs = require('fs');

var ISP_DICT = {
    'TEL': '电信',
    'CNC': '联通',
    'BGP': 'BGP'
};

//ip: obj
var objIPList = {};
var arrIPList = [];

var dict = {
    'TEL': '电信',
    'CNC': '联通',
    'BGP': 'BGP'
};

var dictZH = {
    '电信': 'TEL',
    '联通': 'CNC',
    'BGP': 'BGP'
};

var MODULE_LAST = ';\n\n\nmodule.exports = dict ;';
var MODULE_FIRST = 'var dict = ';


/**
 * hi 设置dict 字段文件
 */
function  getDict() {
    var data;
    var dataZH;
    var cnt = 0;
    fs.readFile(PATH, {
        encoding: 'utf8' 
    }, function (err, _data) {
        if (err) {
            console.log('err in read file');
            return;
        }
        data = _data.split('\n') ;
        cnt += 1;
        if (cnt == 2) {
            check(); 
        }
    });

    fs.readFile(PATH_ZH, {
        encoding: 'utf8' 
    }, function (err, _data) {
        if (err) {
            console.log('err in read file');
            return;
        }

        dataZH = _data.split('\n'); 
        cnt += 1;
        if (cnt == 2) {
            check(); 
        }
        
    });

    function check() {
        var res = analysisRows(data, dataZH); 
        saveDict(res);
        console.log('create file success: dict.js');
    }
}
/**
 * 保存成字典
 */
function saveDict(res) {

    var str = JSON.stringify(res);  
    str = str.replace(/,/g, ',\n');
    str =  MODULE_FIRST + str;

    str += MODULE_LAST;
    fs.writeFile(PATH_DICT, str, {
        encoding: 'utf8' 
    }, function (err) {
    
    });
}





/**
 * rows
 */
function analysisRows(items, itemsZH) {
    var  list = [];
    for (var i = 0, item; item = items[i]; i++) {

        var itemZH = itemsZH[i];

        analysisRow(item, itemZH, dict); 
    }

    return {
        en: dict,
        zh: dictZH
    };
}

var cnt = 0;

/**
 * 根据每行的数据来获取ip的运营商
 */
function analysisRow(row, rowZH) {
    row = trim(row);
    rowZH = trim(rowZH);
    var arr = row.split('|');
    var arrZH = rowZH.split('|');
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];    
        var itemZH = arrZH[i];    
        //都是英文
        if (item.match(/^[a-zA-Z]+$/)) {
            if (!dict[item]) {
                dict[item] = itemZH; 
                dictZH[itemZH] = item; 
                cnt += 1;
            }
        }
    }
}







/**
 * 常用的工具函数---------------------------
 */


function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

getDict();

module.exports = {
    getDict: getDict
};

