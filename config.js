
var mysql = {
    host:'localhost',
    user:'root',
    database:'test',
    password:'test',
    port:3306 
};

var table = 'tb_ipcheck_v2';
//对比国家跟国外
var table = 'tb_ipcheck_v2';

var PATH = {

    IP_EN: '../data/ipv2-20140701-95606.txt',
    IP_ZH: '../data/ipv2-20140701-95606-zh.txt',
    IP_LIST: '../data/ip.list',
    IP_LIST: '../data/pengpengbangbangda.conf',
    DICT: '../data/dict.js'
};





module.exports = {
    mysql: mysql,
    tableName: table,
    PATH: PATH
};
