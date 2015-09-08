/**
 * @file: 刷新js
 * @author: coocon(coocon2007@gmai.com)
 *
 */

define(function (require) {
    var tmpl = require('../common/tmpl');
    var ajax = require('../common/ajax');
    var ls = require('../common/localStorage');
     //dom， theme
    var tableData = require('./tableData');
    var table = require('../common/table');
    var ZH = 'zh-CN';
    var layer = require('../common/layer');
   
    var objParam = {
    
    };
    var model = {
        taskList: [] ,
        isAuto: null
    };
    var URL = {
        DATA: 'getdiff'
    };


    var KEY = 'IS_AUTO';
    var view = {};
    /**
     * 显示信息
     */
    function showMessage(txt) {
        alert(txt); 
    }
    /**
     * 注册事件
     */
    function addEvent() {

        view.btnClear.click(function () {
            view.ips.val('');
        });

        view.btnQuery.click(function () {
            var ips  = $.trim(view.ips.val());
            ips = ips.replace(/\s+/g, '\n');
            ips = ips.replace(/\n+/g, '\n');
            if (!ips) {
                showMessage('ip不能为空');
                return; 
            }
            var arrIP = ips.split('\n'); 
            //每次查询的时候 记录userid
            getIPList(arrIP);
        });
      
    }

    /**
     * 渲染channelList， 调整参数
     */
    function renderIPList(list) {

         
        model.list = list || model.list;
        var tb = table.create({
            fields: tableData.fields, 
            dataSource: model.list,
            className: 'table table-condensed table-bordered',
            wrap: '#ip-table-wrap' 
        });
        tb.render();

    }

    /** 
     *渲染文本
     */
    function renderText(allTotal, total) {
        $('#total').html(allTotal);
        $('#diff').html(total);
    }
    
    /**
     * 通过名字 查询频道列表
     */
    function getIPList(ips) {
        objParam.ips = ips;
        ajax.post(URL.DATA, objParam, function (data, obj) {
            var list = data.list || [];
            if (data.result) {
                renderIPList(list);  
                //renderText(data.allTotal, data.total);
            }
            else {
                layer.alert(obj.statusInfo);      
            }
        });
    
    }

    function initView(userList) {
        view.ips = $('#txtIP');
        view.btnQuery = $('#btn-query');
        view.btnClear = $('#btn-clear');
        //getIPList();
    
    }

    /**
     * 入口函数
     */
    function enter() {
        initView();
        addEvent();
    }

    return {
        enter: enter
    };

});
