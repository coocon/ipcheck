/**
 * @file:  layer 各种tip的函数集合
 * 依赖kendo ui
 * @author: coocon(coocon2007@gmai.com)
 *
 */

define(function (require) {

    var kendo = require('kendo');
    //notice 的各种需求变量、函数
    var eNotice = null;
    var bNoticeMask = false;
    var noticeTimer = null;

    var blank = function () {};
    var LOADING_WRAP = '#loading-tip';
    var TXT_CONFIRM = '您确定吗？';

   
    function clearNoticeTimer() {
        if (noticeTimer) {
            clearTimeout(noticeTimer);
            noticeTimer = null;
        }
    }
    var TMPL = {
        //confrim  的html的结构
        CONFIRM: ' <p style="padding:10px 10px 10px 10px" class="delete-message">%text%</p>'
            +    ' <div style="padding: 10px 30px 10px 20px;text-align: right">'
            +    '      <button class="confirm-ok k-button">确定</button>'
            +    '      <button class="confirm-no k-button">取消</button>'
            +    ' </div>',

        //信息的html结构
        ALERT: ' <p style="padding:10px 10px 10px 10px" class="delete-message">%text%</p>'
            +    ' <div style="padding: 10px 30px 10px 20px;text-align: right">'
            +    '      <button class="alert-ok k-button">确定</button>'
            +    ' </div>'

    
    };


    var layer = {
        /**
         * loading tip的显示功能
         * @param {string} text loading时候的提示语，
         */
        tipShow: function (text) {
            text = text || '加载中...';
            var width = $(window).width();
            var left = width / 2 - 65;
            if ($(LOADING_WRAP).length == 0) {
                $('<div id="loading-tip"></div>').appendTo(document.body); 
            }
            $(LOADING_WRAP).css('left', left).css('display', 'block');

            if (!eNotice) {
                try {
                eNotice = $(LOADING_WRAP).kendoNotification({
                    allowHideAfter: 0,
                    autoHideAfter: 0,
                    button: false,
                    hideOnClick: false,
                    appendTo: $(LOADING_WRAP)
                }).data("kendoNotification");

                    eNotice.show(text);
                } catch(ex) {
                
                }

            }

            $(LOADING_WRAP).fadeOut();
            return true;
        
        },
        tipHide: function () {
            $(LOADING_WRAP).fadeOut();
        },
   
        /**
         * 显示通知浮层
         * 通知浮层位于可视窗口的顶部 用于显示操作结果的提示信息
         * @public
         *
         * @param {string} text 提示文本
         * @param {number} timeout 自动消失的时间间隔 如果不设置则需要通过调用hideNotice来关闭浮层
         */
        notify: function (text, options) {

        },
        /**
         * 关闭通知浮层
         * @public
         */
        hideNotice: function() {
        },

        /**
         * 跟tip相关的mask层
         */
        setNoticeMask: function () {

        },

        /**
         * 清除tip的mask层
         */
        hideNoticeMask: function () {
        },
        /**
         * 显示提示浮层
         * 以模式窗口形式居中显示浮层
         * @public
         *
         * @param {string} text 提示信息
         * @param {Function}  ok 确定按钮的处理函数
         */
        alert: function(text, ok) {
            var kendoWindow = $("<div />").kendoWindow({
                title: "系统消息",
                resizable: false,
                modal: true,
                width: '400px'
            });

            var txt = text || TXT_CONFIRM ;
            var message = TMPL.ALERT.replace('%text%', txt);
            kendoWindow.data("kendoWindow").content(message) .center().open();

            kendoWindow.find(".alert-ok")
            .click(function() {
                if ($(this).hasClass("alert-ok")) {
                    ok && ok();
                }
                
                kendoWindow.data("kendoWindow").close();
            }).end();

        },
        
        /**
         * 显示确认浮层
         * 以模式窗口形式居中显示浮层
         * @public
         *
         * @param {string} text 提示信息
         * @param {Function}  ok 确定按钮的处理函数
         * @param {Function}  cancel 取消按钮的处理函数
         */
        confirm: function(text, ok, cancel) {
            var kendoWindow = $("<div />").kendoWindow({
                title: "系统消息",
                resizable: false,
                modal: true,
                width: '400px'
            });

            var txt = text || TXT_CONFIRM ;
            var message = TMPL.CONFIRM.replace('%text%', txt);
            kendoWindow.data("kendoWindow").content(message) .center().open();

            kendoWindow.find(".confirm-ok, .confirm-no")
            .click(function() {
                if ($(this).hasClass("confirm-ok")) {

                    ok && ok();
                }
                else {
                    cancel && cancel(); 
                }

                kendoWindow.data("kendoWindow").close();
            }).end();

        },

        /**
         * 警告提示浮层
         * 以模式窗口形式居中显示浮层
         * @public
         *
         * @param {string} text 警告信息
         * @param {Function} ok 确定按钮的处理函数，如果此删除为false则不显示确定按钮
         */
        warning: function(text, ok) {
            //TODO
            console.log(text);
        }
    };

    
    
    return layer;
});
