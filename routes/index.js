var express = require('express');
var router = express.Router();
var offlineCheck = require('../agent/offlinecheck');
var iptool = require('../agent/iptool');

var TIME_OUT = 10000;
var timer = null;

var objResult = {
    status: 0,
    statusInfo: '',
    data: {
        result: 1
    }
};
/* GET home page. */
router.get('/', function(req, res) {
    
    var params = {};
    res.render('index', {
        title: 'ip对比'
    });

});

router.post('/getdiff', function(req, res) {
    console.log(req.body);
    var ips = req.body['ips[]'];    
    var ip;
    var dataList = [];
    if (!ips) {
        return; 
    }
    if (Object.prototype.toString.call(ips) != '[object Array]') {
        ips = [ips]; 
    }
    var len = ips.length;
    var count = 0;
    ips.forEach(function (item) {
        iptool.getItemInfo(item, function (data) {
            count += 1;
            data.ip = item;
            dataList.push(data); 
            if (count == len) {
                objResult.data.list = dataList;
                clearTimeout(timer);
                res.json(objResult);    
            }
        }); 
    });
    
    //timer = setTimeout(function () {
     //   objResult.data.List = dataList;
     //   res.json(objResult);    
    //}, TIME_OUT);

});

module.exports = router;
