/**
 * @file: capslock 
 * 功能模块，用来监控一个元素 是否开启大小写 
 *
 * @author coocon2007@gmail.com
 */

define(function (require) {

    /**
     *  caplock constructor
     *
     */
    function Capslock() {

        this.isLock = false; 
    }

    var blank = function () {};

    Capslock.prototype.onKeyPress = function (e) {
    
        e = e ||  window.event; 
        var key =  e.which;
        var isShiftDown = e.shiftKey;
        if ((64 < key && key < 91 && !isShiftDown)
            || (96 < key && key < 123 && isShiftDown)) {
                this.isLock = true;
        } else {
            this.isLock = false;
        } 

    };


    Capslock.prototype.bind = function (target, onLock, onUnlock) {
        onLock = onLock || blank;
        onUnlock = onUnlock || blank;
        var me = this;
        $(target).keypress(function (e) {
            me.onKeyPress(e);
            if (me.isLock) {
                onLock.call(target);
            }
            else {
                onUnlock.call(target);
            }
        }).blur(function () {
            onUnlock(target);
        }); 

    };

    /** 
     * 暴露出去的监控的方法
     * @param {htmlElment} target 目标元素（password's input） 
     * @param {Function} onLock 大写功能开始
     * @param {Function} onUnlock 大写关闭的事件
     */
    function observer (target, onLock, onUnlock) {
        var capslock = new Capslock(); 
        capslock.bind(target, onLock, onUnlock);
    }

    return {
        /** 
         * 暴露出去的监控的方法
         * @param {htmlElment} target 目标元素（password's input） 
         * @param {Function} onLock 大写功能开始
         * @param {Function} onUnlock 大写关闭的事件
         */

        observer: observer
    };

});
