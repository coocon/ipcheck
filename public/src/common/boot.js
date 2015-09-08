/**
 * @file: boot 
 * 页面启动时候 常用的功能集合 
 * @author coocon2007@gmail.com
 */

define(function (require) {
    var backtop = require('./backtop');
    var menu = require('./menu');
    var condition = require('./condition');


    return {
        /**
         * 渲染菜单
         */
        renderMenu: menu.render ,
        /**
         * @param {Object} options  参数
         * @param {Object} options.top  距离顶端多久出现滚动条
         */
        renderBackTop: backtop.init,

        renderDate: condition.renderDate,

        renderGroup: condition.renderGroup
 
    };
});
