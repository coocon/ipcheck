/**
 * @file:  table CLASS
 *  
 * @author coocon2007@gmail.com
 */

define(function (require) {
    var util = require('./util');
    
    var encode = util.encodeHTML;
    var TEXT_NO_DATA = '暂无数据';

    /**
     * 构造函数
     * @param {Object} options
     */
    function Table(options) {
        this.__uuid = util.guid(); 
        this._fields = options.fields;
        this._dataSource = options.dataSource;
        this._className = options.className;
        this._wrap = $(options.wrap);
        this.__html = '';
        this._main = null;
        this._checkbox = options.checkbox;
        this._checkboxName = options.checkboxName;
        this._radio = options.radio;

    }

    var TABLE_CLASS = Table.prototype;


    /**
     * 获取表格的实例
     *
     */
    function  create(options) {
        var opt = {
            fields: [],
            dataSource: [],
            wrap: null
        };
        var _options = $.extend(opt, options);

        var tb  = new Table(_options); 
        //tb绑定事件
        bindClickEvent(tb);
         
        return tb;
         
    }

    /**
     * 绑定事件
     *
     */
    function bindClickEvent(tb) {
         
        //click event
        var handler = function (tb) {
            return function(e) {
                  
                var item = $(this);
                //master sub
                var checkType = item.attr('data-checktype');
                var isInput = item.is('input');
                var index = item.attr('data-index');
                if (isInput && checkType) {
                    var value = item[0].checked;
                    if (checkType == 'master') {
                        
                            tb.getWrap().find('tbody input[type="checkbox"]').each(function (item) {
                                index = $(this).attr('data-index');
                                $(this)[0].checked = value; 
                                var data = tb.getDataByIndex(index);
                                tb.oncheck && tb.oncheck(this, data, index);
                            });
                    }
                    else {
                    
                        var data = tb.getDataByIndex(index);
                        tb.oncheck && tb.oncheck(item, data, index);
                    }
                }
        
            };
        };
        var wrap = tb.getWrap();

        $(wrap).delegate('input', 'click',  handler(tb));
    }

    /**
     * 获取table对象的 html对象
     *
     * @return {HTMLElement} 返回html对象
     */
    TABLE_CLASS.getWrap = function () {
        return this._wrap; 
    };

    TABLE_CLASS.setHTML = function (html) {
        this.__html = html || '';
        if (this._wrap && this._wrap.length) {
            this._wrap.html(this.__html);
        }
        else {
            throw 'no wrap to render table' ;
        }
    };

    /**
     * 渲染表格啊啊
     * @param  {array[Ojbect]} optoins.feilds  [{title:'aa',width: 50}, ...]
     *
     * @param  {array[Ojbect]} dataSource [{name: 'aa', time: '19200-222'}, ...]
     * @param {Object} options.dataSource
     * @param {string} options.className
     * @param {boolean} options.checkbox
     * @param {boolean} options.radio
     */

    TABLE_CLASS.render = function (options) {
        options = options || {};
        var tbNum = this.__uuid;
        var fields = $.extend([], options.fields || this._fields || []);
        var dataSource = $.extend([],options.dataSource || this._dataSource || []);
        this._dataSource = dataSource;
        this._fields = fields;
        this._noDataText = options.noDataText || TEXT_NO_DATA;
        var className = options.className || this._className || 'table table-color table-bordered ';
        var tpl = []; 
        tpl.push('<table class="' + className + ' " id="' + tbNum+ '">');
        tpl.push('<thead><tr>');
        var headValue = [];
        var name = '';
        var itemField = '';

        var align = 'left';
        //radiobox
        if (this._radio) {
            fields.unshift( {
                title: '',
                value: function (data, index) {
                    return '<input data-checktype="sub" type="radio" data-index="' + index + '" name="table-' + tbNum+ '" >';
                }
            }); 
        }

        if (this._checkbox) {
            name = options.checkboxName || this._checkboxName;
            fields.unshift( {
                title:  '<input data-checktype="master" data-index="-1" type="checkbox" name="all-table-' + tbNum+ '" > &nbsp;' + name ,
                value: function (data, index) {
                    return '<input data-checktype="sub" type="checkbox" data-index="' + index + '" name="table-' + tbNum+ '" >';
                }
            }); 
        }

        for (var i = 0, len = fields.length; i < len; i++) {
            itemField =  fields[i];
            align = itemField.align || 'left';
            tpl.push('<th style="text-align:' + align + '">' + itemField.title + '</th>'); 
            //渲染body时候 用到的字段
            headValue.push(itemField.value); 
        }

        tpl.push('</th></thead>'); 
        tpl.push('<tbody>');
        //渲染tbody的内容,遍历数据dataSource，然后 遍历fields来得到相应的data数据的key
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var data = dataSource[i];
            var valueKey = '';
            var item ;
            tpl.push('<tr>');
            // 得到了 每条记录数据的obj
            tpl.push(createRow(fields, data, i));
            tpl.push('</tr>');
        }
        if (dataSource.length === 0) {
            createBlankRow(this, tpl);
        } 
        tpl.push('</tbody></table>');
        var str =  tpl.join('');
        
        this.setHTML(str);
        return this;
    };
    /**
     * @inner 若没有数据 产生一个空白表格
     */
    function  createBlankRow(tb, tpl) {
        var len = tb._fields.length;
        var text = tb._noDataText;
        tpl.push('<tr><td align="center" colspan="' + len + '">' + text + '</td></tr>');
    
    }
    
    /**
     * row create  渲染一行的书  有head的fields 和row的数据
     * @param {Array[Object]}  fields   head的fields数组
     * @param {Object}  dataRow  每一行的数据 
     *
     * @return  生成的html的内容
     */
    function createRow(fields, dataRow, rowIndex) {
        var itemField = null;
        var valueKey = null;
        var align = null;
        var tbodyValue = '';
        var width = '*';
        var tpl = [];
        var cls = ''
        for (var j = 0, jLen = fields.length; j < jLen ; j++) {
                //valueKey =  feilds[j];
                itemField = fields[j];
                valueKey = itemField.value;
                align = itemField.align || 'left';
                width = itemField.width || '*';
                cls = itemField.className || null;
                if (typeof valueKey == 'string') {
                    tbodyValue = encode(dataRow[valueKey] || '');
                }
                //这货是个function
                else if (Object.prototype.toString.call(valueKey) == '[object Function]') {
                    tbodyValue = valueKey.call(null, dataRow, rowIndex);
                }
                if (cls) {
                
                    tpl.push('<td class="' + cls+'" width="' + width + '" align=" ' + align +'">' + tbodyValue + '</td>');
                    continue;
                }
                tpl.push('<td width="' + width + '" align=" ' + align +'">' + tbodyValue + '</td>');
        }

        return tpl.join('');
    }

    /**
     * checkbok ,radio的 check事件
     */
    TABLE_CLASS.oncheck = function (item, data) { 
        console.log('checked:',item, data); 
    };

    /**
     *  根据index获取data
     */
    TABLE_CLASS.getDataByIndex = function (index) {
        var dataList = this._dataSource || [];  
        return dataList[index]; 

    };

    
    /**
     *  根据index获取data
     */
    TABLE_CLASS.getHTML = function () {
        return this.__html; 
    };



    return {
        /**
         * 产生表格的实例
         * @param {Object} 
         * @param {string} options.fields
         * @param {string} options.dataSource
         * @param {string} options.checkbox
         * @param {string} options.radio
         * @param {HTMLElement} options.wrap
         * 
         * @return {Object|Table| talble
         */
        create: create 
    };
});
