/**
 * @file: profile-password页面
 * @author: coocon(coocon2007@gmail.com)
 *
 */

define(function (require) {
    var ajax = require('../common/ajax');

    var capslock = require('../common/capslock');

    var layer = require('../common/layer');
    var TIP = {
        NO_SAME: '两次输入的密码不同'
    
    };

    var view = {};
    var model = {};

    //url 
    var URL = {
        RESET: 'index.php?controller=default&action=domodify' 
    
    };

    var MAX_WAIT = 60;
    var TIME_INTERVAL = 1000;

    /**
     * 显示出错信息
     *  @param {string} msg 提示内容
     */
    function showMessage(msg) {
    
        msg = msg || ''; 
        //error tip
        view.errorTip.html(msg); 
    }

    /**
     * @param {string} password  
     *
     */
    function setPassword(password, password2) {
        var data = {
            old: password,
            'new': password2
        };
        //要求发送验证码
        ajax.post(URL.RESET, data,  function (data, obj) {
            //1,0  true, false
            if (data.result) {
                location.href = data.location;
            } 
            else {
                showMessage(obj.statusInfo) 
            }

        });  
    }

    /**
     * 验证的逻辑
     *
     * @param {string} password
     * @param {string} password2
     *
     * @return {boolean}  result 查看返回值 是否正确
     */
    function verify(password, password2) {
        var result = true;
        if (password != password2) {
            result = false;
        }
        
        return result; 
    }
    /**
     * 注册 事件
     */
    function addEvent() {
        //注册事件
        view.btnNext.click(function () {
            var password = $.trim(view.password.val());
            var password2 = $.trim(view.password2.val());
            var password0 = $.trim(view.password0.val());

            if (verify(password, password2)) {
                setPassword(password0, password); 
            }
            else {
                console.log(TIP.NO_SAME);
                layer.alert(TIP.NO_SAME);
            }

        }); 
        //检测密码是否开启大写功能
        capslock.observer(view.password, 
            //daxie
            function () {
                view.capsTip.show(); 
            },
            //小xie
            function () {
            
                view.capsTip.hide(); 
            }
        );

        capslock.observer(view.password2, 
            //daxie
            function () {
                view.capsTip2.show(); 
            },
            //小xie
            function () {
                view.capsTip2.hide(); 
            }
        );

        capslock.observer(view.password0, 
            //daxie
            function () {
                view.capsTip0.show(); 
            },
            //小xie
            function () {
                view.capsTip0.hide(); 
            }
        );
    

    }
    /**
     * init view 
     */
    function initView() {
        view.btnNext = $('#btn-next'); 
        view.password = $('#txt-password');
        view.password2 = $('#txt-password2');
        view.capsTip = $('#capsLockHint');
        view.capsTip2 = $('#capsLockHint2');
        view.capsTip0 = $('#capsLockHint0');
        view.errorTip = $('#txt-error');

        view.password0 = $('#txt-password0');

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

