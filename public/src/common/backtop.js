/**
 * @file: backtop 返回顶部 
 * 依赖jquery
 * 不考虑ie6的  fixed定位问题
 * @author coocon2007@gmail.com
 */

define(function (require) {
   
    var model = {
        top: 600 
    };
   
    function bindEvent(options) {
        var topShow = model.top;
        //距离多远可以出返回按钮
        if (options && options.top) {
            topShow = options.top; 
        }

        $(window).on('scroll', function () {
            var top = $(window).scrollTop();
            if (top > topShow) {
                $('#backTop').show(); 
            }
            else {
                $('#backTop').hide(); 
            }
        });

        $('#backTop').click(function () {
            $("html,body").animate(
                {
                    scrollTop: $("body").offset().top
                }
            );
        }); 
    
    }

    function init(options) {
                //bu存在
        if (!$('#backTop').length) {
            $('<div class="backTop" id="backTop" title="返回顶部"></div>').appendTo(document.body);
        }
        bindEvent(options);
         
    }
    return {
        init: init 
    }
});
