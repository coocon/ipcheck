/**
 * @file:  常用的功能函数 
 *  
 * @author coocon2007@gmail.com
 */

define(function (require) {
    //流量的单位
    var UNIT_FLOW = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    //带宽的单位
    var UNIT_BAND = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'];
    var UNIT_BAND = ['b/s', 'Kb/s', 'Mb/s', 'Gb/s', 'Tb/s', 'Pb/s'];

    var PASS_LENGTH = 12;
    // c, k, o, p, s, v, w, x, z  不容易区分就去掉啦
    // 0也不好认出来
    var list = [
        'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'q', 'r', 't', 'u', 'y' ,
        'A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'Q', 'R', 'T', 'U', 'Y',
        '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];
    var len = list.length;
    var reg = /\w+\d+|\d+\w+/;

    var bizList = {
        1000: '静态页面加速',
        2000: '动态页面加速', 
        3000: '下载加速' ,
        4000: '流媒体加速' ,
    };

    /**
     * 获取业务类型
     */
    function getBizType(code) {

        var res = bizList[code] || code;

        return res; 
    }
    /**
     * 生成随机密码 ： 字母和数字
     * @param {number} length   密码的长度
     *
     * @return {string}    返回密码
     */
    function createPassword(length) {
        length = length || PASS_LENGTH;
        var str = '';
        for (var i = 0; i < length; i++) {
            var index = Math.random() * len | 0; 
            str += list[index];
        }

        if (!str.match(reg)) {
            str[0] = 'M'; 
            str[length-1] = '9'; 
        }
        return str;
    }

    /**
     * @param {string} str 字符串
     *
     * @return {string} html 返回编码过的字符串
     */
    function encodeHTML (str) {
        return String(str)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
    
    }

    /**
     * 生成GUID
     * @private
     *
     * @refer http://goo.gl/0b0hu
     */
    function createGUID() {
        var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return str.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**
     * 补齐
     */
    function numberPad(source, length) {

        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));

        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }

        return (negative ?  "-" : "") + pre + string;
}
    /**
     *
     * from baidu tangram
     */
    var dateFormats = function (source, pattern) {
        if ('string' != typeof pattern) {
            return source.toString();
        }
     
        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }
         
        var pad     = numberPad,
            year    = source.getFullYear(),
            month   = source.getMonth() + 1,
            date2   = source.getDate(),
            hours   = source.getHours(),
            minutes = source.getMinutes(),
            seconds = source.getSeconds();
     
        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);
     
        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);
     
        return pattern;
    };
    /**
     * 一下是设备上报的代码
     * @param {htmlElement} form form表单
     */
    
    function getFormData(form) {
        form = form;
        var inputs = $(form).find('*');
        var obj = {};
        for (var i = 0; i < inputs.length; i++) {
            var input = $(inputs[i]);
            var name = input.attr('name');
            var type = input.attr('type');
            
            if (name) {
                if (type == 'radio') {
                   if (input[0].checked) {
                       obj[name] = input.val();  
                   }
                }
                else if (type == 'select') {
                    obj[name] =  input.find('option[checked]').val();
                }
                else {
                    obj[name] = input.val(); 
                }
            }
        }
        return obj; 
    }

    function cut(str, len) {
        len = len || 10;
        var value = '';
        if (str.length > len) {
            value = str.slice(0, len);

            return '<span title="' + encodeHTML(str) + '">' + value + '</span>' ;
        } 

        return str; 
    }

    /**
     * 时间转化的函数
     * 专门适应php的10位时间戳
     *TODO:  时间转化函数
     */
    function dateFormat(t, format) {
        t += ''; 
        if (t.length == 10) {
            t = t * 1000; 
        }
        else if (t.length == 13) {
            t = t * 1; 
        }
        
        var d = new Date(t); 
        var str;
        
        if (format) {
            str = dateFormats(d, format);
        }
        return str;
    }


    function setHTML(item, value) {
        item.html(value); 
    }
    var funList = {
        'p': setHTML,
        'span': setHTML,
        'em': setHTML,
        'dd': setHTML,
        'dt': setHTML,
        'div': setHTML
    };
    /**
     *
     */
    function setValue(item, value) {
        var tagName = item[0].tagName.toLowerCase();

        item.val(value); 
        funList[tagName] && funList[tagName](item, value);
    }
    /**
     * 渲染form表单的数据
     */
    function renderFormData(form, obj) {

        form = form ;
        var inputs = $(form).find('*');
        obj = obj || {};
        for (var i = 0; i < inputs.length; i++) {
            var input = $(inputs[i]);
            var name = input.attr('name');
            var type = input.attr('type');

            if (name) {
                if (type == 'radio' ) {
                    if ( input.val() == obj[name]) {
                        input[0].checked = true;
                    }
                }
                else {

                    setValue(input, obj[name]); 
                }
            }
        }
           
    }

    /**
     * hehe :php是 10位的时间戳耶
     * @param {Object|string}  date
     * @Param {boolean} isZero  是否是0点
     */
    function toPhpTime(date, isZero) {
        var str = '';
        isZero = isZero  || false;

        if ('[object Date]' == ({}).toString.call(date)) {
            str = date.getTime() + ''; 
            str = str.substr(0, 10)
        }
        else if ('[object Number]' == ({}).toString.call(date)) {
            date += ''; 
            str = date.substr(0, 10)
        }
        else if ('[object String]' == ({}).toString.call(date)) {
            str = date.substr(0, 10)
        }
        
        str = dateFormat(str, 'yyyyMMdd');
        return str;

    }
    /**
     * 计算单位
     */
    function calUnitObj(num, units, fixedLen) {
        var units = units || ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb']; 
        var index = 0; 
        var fixedLen = fixedLen || 2;
        var str = (+num).toFixed(0);
        var len = str.length;
        var rate = 1;
        index = parseInt(len / 3, 0);
        var n = num;
        if (len % 3 == 0) {
            index -= 1; 
        }
        if (index > 0) {
            rate = Math.pow(1000, index);
            n = (num / rate).toFixed(fixedLen);
        }

       
        return {
            unit: units[index],
            rate:  rate,
            num: n
        }
    }

    /**
     * 计算单位 已经乘以8
     */
    function calBandUnit(num, units) {
        //TODO: 乘八的地方
        var units = units || ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb']; 
        var index = 0; 
        var str = ((+num) * 8).toFixed(0);
        var len = str.length;
        index = parseInt(len / 3, 10);

        if (len % 3 == 0) {
            index -= 1; 
        }

        return units[index];
    }
    /**
     * 计算单位
     */
    function calUnit(num, units) {
        var units = units || ['B', 'KB', 'MB', 'GB', 'TB', 'PB']; 
        var index = 0; 
        var str = (+num).toFixed(0);
        var len = str.length;
        index = parseInt(len / 3, 0);

        if (len % 3 == 0) {
            index -= 1; 
        }

        return units[index];
    }

    /**
     * 格式化数字,转为千分制的数字
     * 123456 => 123,456
     * 1234 => 1,234
     * @param {string|number} number
     * @param {boolean} needunit 是否需要单位 ，默认是MB
     * @return {string} 增加逗号以后的数字
     */
    function formatNumber(number, needUnit) {
        number += '';
        var arr = number.split('').reverse();
        var res = [];
        for (var i = 0; i < arr.length; i++) {
            res.push(arr[i]);
            if (i % 3 == 2) {
                res.push(','); 
            }
        } 

        res = res.reverse().join('');
        res = res.replace(/^,/, '');
        if (needUnit) {
            res += ' ' + calUnit(number);
        }
        return res;

    }

    function formatPercent(number, len) {
        len = len || 2;
        
        var str = (+number).toFixed(len) + '%';
        return str;
    }

    /**
     * 传入数组对象，获取响应信息
     * @param {Array.<Object>} dataList
     */
    function handleLineData(dataList, options) {
        //hour, day
        var lidu = options.lidu || 'hour'; 
        var multiple = options.multiple  || 1;
        if (multiple != 1) {
            //循环
            $.each(dataList, function (index) {
                var item = this;
                item.value = item.value * multiple;
            }); 

        }

        //保留两位小数
        var len = options.length || 2;
        //leixing
        var type = options.type;

        var units = UNIT_FLOW;
        
        if (type == 'flow') {
            units = UNIT_FLOW; 
        }
        else if (type == 'band') {
            units = UNIT_BAND; 
        }

        var xData = [];
        var _xData = [];
        var yData = [];
        var _yData = [];

        var reg = '';
        if (lidu == 'hour') {
            reg = 'MM-dd HH:mm';
        }
        else if (lidu == 'day') {
            reg = 'MM-dd';
        }
        else {
            reg = lidu; 
        }
      
        //循环
        $.each(dataList, function (index) {
            var item = this;
            var time = dateFormat(item.time, reg);
            _yData.push(item.value);
            _xData.push(item.time);
            xData.push(time);  
        }); 

        
        //利用原生函数去搞
        var maxNum = Math.max.apply(null, _yData);

        var unitObj = calUnitObj(maxNum, units);
        var rate = unitObj.rate;
        for (var i = 0; i < _yData.length; i++) {
            //var value =  (_yData[i] * multiple / rate).toFixed(len);
            var value =  (_yData[i] / rate).toFixed(len);
            yData.push (+value);

        }
        var max =  +(maxNum / rate).toFixed(len);

        return {
            xData: xData,
            yData: yData,
            _yData: _yData,
            _xData: _xData,
            max: max,
            unit: unitObj.unit,
            rate: unitObj.rate
        };
    }


    function  autoAddUnit(num, options) {
        var type =  options.type || 'flow';
        var len = options.len || 2;
        //TODO: 乘8
        var multiple = 1;
        var units = UNIT_FLOW;
        if (type == 'flow') {
            units = UNIT_FLOW; 
        }
        else if (type == 'band') {
            units = UNIT_BAND; 
            multiple = 8;
        }
        var obj = calUnitObj(num, units);
        var num2 = ( num * multiple / obj.rate).toFixed(len);
        return num2 + ' ' +  obj.unit;
    }
    /**
     *  平滑数据
     */
    function floorData(dataList) {
         
        var per = 0.4;
        for (var i = 1 ; i< dataList.length-1; i+=1) {
    
            var v0 = dataList[i-1].value;
            var v1 = dataList[i].value;
            var v2 = dataList[i+1].value;
            var max = Math.max(v0, v1, v2);
            v0 = v0 + (max - v0) * per;
            v1 = v1 + (max - v1) * per;
            v2 = v2 + (max - v2) * per;

            dataList[i-1].value = v0 ;
            dataList[i].value = v1 ;
            dataList[i+1].value = v2 ;
        }
        return dataList;
    }

    return {

        formatNumber: formatNumber,
        formatPercent: formatPercent,
        createPassword: createPassword ,
        encodeHTML: encodeHTML,
        guid:  createGUID,
        dateFormat: dateFormat,
        getFormData: getFormData,
        //给php的时间戳
        toPhpTime: toPhpTime,
        renderFormData: renderFormData,
        calUnit: calUnit,
        calBandUnit: calBandUnit,
        calUnitObj: calUnitObj,
        //转为有单位的数字,并保留小数 单位处理
        autoAddUnit: autoAddUnit,
        handleLineData: handleLineData,
        cut: cut,
        getBizType: getBizType,
        floorData: floorData
    };
});
