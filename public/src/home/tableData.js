/**
 * @file: 带宽信息的tableData
 * @author: coocon(coocon2007@gmai.com)
 */

define(function (require) {

    /**
     * 渲染模板
     */
    function renderTMPL(obj) {
        var tpl = '<ul>'
            +       '<li>国家：#country</li>' 
            +       '<li>省份：#province</li>' 
            +       '<li>城市：#city</li>' 
            +       '<li>ISP：#isp</li>' 
            +     '</ul>'
        return tpl.replace('#country', obj.country || '-') 
                    .replace('#province', obj.province || '-') 
                    .replace('#city', obj.city || '-') 
                    .replace('#isp', obj.isp || '-') 
    }
    
    var head = [
        {
            title: '顺序',  
            width: '50px',
            value: function (item ,i) {
                return i; 
            }
        }, {
            title: 'ip',
            width: '100px',
            value: 'ip'
        
        }, {
            title: '17mon',
            value: function (item) {
                return renderTMPL(item['17mon']  || {});
            }
        }, {
            title: 'taobao',
            value: function (item) {
                return renderTMPL(item['taobao']  || {});
            }
        }, {
            title: 'sina',
            value: function (item) {
                return renderTMPL(item['sina'] || {});
            }
        }
    ];

    return  {
        fields: head
    };
});
