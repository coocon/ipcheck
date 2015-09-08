/**
 * @file: 刷新js
 * @author: coocon(coocon2007@gmai.com)
 *
 */

define(function (require) {
    var tmpl = require('../common/tmpl');
    var ajax = require('../common/ajax');
     //dom， theme
    var ZH = 'zh-CN';
    var layer = require('../common/layer');
    // model
   
    var model = {
        taskList: [] 
    };
    var URL = {
        LOGIN: '/index.php?controller=default&action=dologin'
    };
    var TEXT = {
        LOW: '<p class="content">尊敬的用户您好，目前我们已经取消对IE9以下浏览器的兼容,请更换或者升级浏览器，进行登陆</p>',
        BROWSER: '<p><a href="http://w.x.baidu.com/alading/anquan_soft_down_b/14744">chrome浏览器下载</a></p>'
                + '<p><a href="http://w.x.baidu.com/alading/anquan_soft_down_normal/11843">fiefox浏览器下载</a></p>'
    };
    var view = {};

    var isAllowLogin = true;

    /**
     * 显示浏览器
     */
    function showErrorTip() {
    
        var msg = TEXT.LOW + TEXT.BROWSER;
        layer.alert(msg);
    }
   
    /**
     * 注册事件
     */
    function addEvent() {


        capsLock.observer($('#txt-password'), function () {
            $('#capsLockHint').show();
        }, function () {
            $('#capsLockHint').hide();
        });
        $('#login-form')[0].onsubmit = function () {
            $('#btn-login').click();
            return false;   
        };
        $('#btn-login').click(function () {
            
            var url =  URL.LOGIN;

            var username = $.trim($('#txt-username').val());
            var password = $.trim($('#txt-password').val());

            if (username == '') {
                showMessage('用户名不能为空'); 
                return;
            }
            if (username == '') {
                showMessage('密码不能为空'); 
                return;
            }
            $.ajax(url, {
                method: 'post',
                data: {
                    username: username,
                passwd: password,
                csrf: _CSRF
                },
                success: function (obj) {
                    var data = obj.data;
                    if (obj.status == 0 && data.result)  {
                        showMessage('');
                        location.href = data.location || '#';
                    }
                    else {
                        showMessage(obj.statusInfo);
                    }
                },
                fail: function (obj) {

                    var txt = obj.statusInfo || '系统正忙，请稍后再试';
                    showMessage(txt);
                }

            });

        });
    }



    /**
     *  show message
     */
    function showMessage(msg) { 
        msg = msg || '';
        $('#txt-error').html(msg);
    }

    var capsLock = function () {

        var isLock = false;
        var blank = function () {};
        function onKeyPress(e) {
            e = e ||  window.event; 
            var key =  e.which;
            var isShiftDown = e.shiftKey;
            if ((64 < key && key < 91 && !isShiftDown)
                    || (96 < key && key < 123 && isShiftDown)) {
                        isLock = true;
                    } else {
                        isLock = false;
                    } 
        }
        var observer = function (target, onLock, onUnlock) {

            onLock = onLock || blank;
            onUnlock = onUnlock || blank;
            $(target).keypress(function (e) {
                onKeyPress(e);
                if (isLock) {
                    onLock();         
                }
                else {
                    onUnlock();
                }
            }).blur(function () {
                onUnlock();
            }); 
        }

        return {
            observer: observer
        };

    }();


    function initView() {
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
