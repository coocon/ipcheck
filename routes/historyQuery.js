/**
 * 历史的ipcheck功能
 * 从网上拔取数据，然后对比展示 
 */
var express = require('express');
var router = express.Router();
var offlineCheck = require('../agent/offlinecheck');

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
    res.render('historyQuery', {
        title: 'ip对比'
    });

});

router.post('/getdiff', function(req, res) {
    
    var params = {};
    offlineCheck.getDiffData(params, function (list, allTotal) {
        objResult.data.list = list;
        objResult.data.allTotal = allTotal;
        objResult.data.total = list.length;
        res.json(objResult);
    });

});

module.exports = router;
