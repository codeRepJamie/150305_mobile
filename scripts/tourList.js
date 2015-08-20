/**
 * Created by Administrator on 2015/3/15.
 */

$(function(){
    //页面初始化
    $.initialTourList('destination');
    /*右栏弹出插件*/
    $('#search').rightCont();
    //初始化筛选
    /* 参数
     * @param trigger 绑定触发元素
     * Type:{DOMElement, jQuery, Object}
     *
     * @param resetBtn 绑定重置按钮元素
     * Type:{DOMElement, jQuery, Object}
     *
     * @param resetBtn 绑定重置按钮元素
     * Type:{DOMElement, jQuery, Object}
     *
     * @param confirmCallback 确定按钮按下后回调函数
     * Type:{Function}
     *
     * @param resetCallback 重置按钮按下后回调函数
     * Type:{Function}
     *
     * @param cancelCallback 取消按钮按下后回调函数
     * Type:{Function}
     *
     * @param onItemsTap 筛选项按钮按下后回调函数
     * Type:{Function}(elem,index,val)
     ** @param elem 选中的DOM元素
     ** Type:{DOMElement}
     ** @param index 选中的筛选项序号
     ** Type:{Number}
     ** @param val 选中的筛选项的值
     ** Type:{String}
     *
     */
    $('#BoxContent').boxContentInital({
        trigger:$('#BottomNav li:eq(1)'),
        //更新页面
        comfirmCallback:function() {
            $.initialTourList('destination');
        },
        onItemsTap:function(elem,key,val){

        }
    });
    $('#destination').simpleListInital({
        trigger:$('#BottomNav li:eq(0)'),
        onListsTap:function(elem,key,val){
            //console.log(elem,key,val);
        }
    });
    $('#sortOrder').simpleListInital({
        trigger:$('#BottomNav li:eq(2)'),
        onListsTap:function(elem,key,val){
            //console.log(elem,key,val);
        },
        initialCallback:function(handle){
            handle.selectTap(2);
        }
    });
    $('#BottomNav>li').displayWrap({
            callback:function(state,wrap){
                $(wrap).siblings('.filter_pop_wrap').css({'visibility': 'hidden'});
                $(this).siblings('li').each(function (i, e) {
                    e.activeSate = 0;
                    $(e).removeClass('active');
                });
            },
            hiddenCallback:function(){
                $('#BottomNav>li').removeActive();
            }
      });

});