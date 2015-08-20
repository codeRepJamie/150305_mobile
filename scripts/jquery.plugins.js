/**
 * Created by lenovo on 2015/3/22.
 */
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {
        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {expires: -1}));
        return !$.cookie(key);
    };



}));
(function ($) {
    $.extend({
        /*追加对象属性*/
        /*是否正在显示警告栏*/
        isShowAlert: false,
        detailPopInfo:{
            isOpen:false,
            trigger:null,
            wrap:null,
            dataRel:undefined,
            head:null
        },
        /*jquery 静态方法*/
        /*隐藏黑色图层*/
        hideBottomLayout: function (opts) {
            var _default = {
                shadow: $('#PopMaskWrap'),
                callback: null
            };
            _default = $.extend(_default, opts);
            /*_default.shadow.css({
                'display': 'none'
            });*/
            var filter=$('.filter_pop_wrap:visible');
            var visibleFilterTrigger=filter.each(function(i,e){
                if($(e)[0].trigger){
                    $($(e)[0].trigger).removeActive();//TODO hideBottom
                }
            });
            filter.css({'visibility': 'hidden'});
            _default.shadow.remove();
            $('body').unIScroll();
            _default.callback && _default.callback.call(this);
        },
        //简单警告框插件
        /*
         * 参数
         * @param text 警告文本(直接量)
         * Type:{String}
         * 可直接写$.simpleAlert('显示文本')
         *
         * @param during 持续时间
         * Type:{Number}
         *
         * @param animateTime 动画时间
         * Type:{Number}
         *
         * @param startPos 起始位置,中间向上多数像素
         * Type:{Number}
         *
         */
        simpleAlert: function (opts) {
            if (!$.isShowAlert) {
                $.isShowAlert = true;
                var _default = {
                    text: '简单警告框',
                    during: 1500,
                    animateTime: 300,
                    startPos: 80
                };
                if (typeof opts == 'string') {
                    _default.text = opts;
                }
                else if (typeof opts == 'object') {
                    _default = $.extend(_default, opts);
                }
                var oAlert = document.createElement('div');
                var midHeight;
                oAlert.className = 'alert';
                oAlert.innerHTML = _default.text;
                oAlert.style.opacity = 0;
                $('body').append(oAlert);
                midHeight = $(oAlert).innerHeight() / 2;
                oAlert.style.marginTop = -midHeight - _default.startPos + 'px';
                $(oAlert).stop(0, 1).animate({
                    'margin-top': -midHeight,
                    'opacity': 1
                }, _default.animateTime, function () {
                    $(oAlert).delay(_default.during).animate({
                        'margin-top': -midHeight - _default.startPos,
                        'opacity': 0
                    }, _default.animateTime, function () {
                        $(this).remove();
                        $.isShowAlert = false;
                    });
                });
            }
        },
        //对话框警告插件
        /*
         * 参数
         * @param text 警告文本(直接量)
         * Type:{String}
         * 可直接写$.dialogAlert('显示文本')
         *
         * @param animateTime 动画时间
         * Type:{Number}
         *
         * @param startPos 起始位置像素
         * Type:{Number}
         *
         * @param confirmText 确定按钮文本
         * Type:{String}
         *
         * @param confirmText 取消按钮文本
         * Type:{String}
         *
         * @param onConfirm(elem) 按下确定按钮回调函数(直接量) --> window
         * 可直接写$.dialogAlert('显示文本',function(){ //程序 })
         * Type:{Function}
         ** @param elem 确定按钮
         ** Type:{jQuery}
         *
         * @param onCancel 按下取消按钮回调函数 --> window
         * Type:{Function}
         ** @param elem 取消按钮
         ** Type:{jQuery}
         *
         */
        dialogAlert: function () {
            if (!$.isShowAlert) {
                $.isShowAlert = true;
                var _default = {
                    text: '对话框警告',
                    animateTime: 300,
                    startPos: 80,
                    confirmText: '继续',
                    cancelText: '取消',
                    onConfirm: null,
                    onCancel: null
                };
                if (typeof arguments[0] == 'string' && (typeof arguments[1] == 'function' || arguments[1] == null)) {
                    _default.text = arguments[0];
                    _default.onConfirm = arguments[1];
                }
                else if (typeof arguments[0] == 'object') {
                    _default = $.extend(_default, arguments[0]);
                }
                var oAlert = document.createElement('div');
                oAlert.className = 'js_shadow_root';
                oAlert.innerHTML = '<section class="cm-modal cm-modal--alert"><div class="cm-modal-bd"><div class="cm-mutil-lines">' + _default.text + '</div></div><div class="cm-actions  "><span class="js_cancel cm-actions-btn">' + _default.cancelText + '</span><span class="js_ok cm-actions-btn">' + _default.confirmText + '</span></div></section>';
                var midHeight, oConfirm, oCancel;
                var width = $(window).width() * .8;

                $('body').append(oAlert);
                oConfirm = $('.js_ok');
                oCancel = $('.js_cancel');
                oAlert.style.opacity = 0;
                oAlert.style.zIndex = 101;
                oAlert.style.width = width + 'px';
                midHeight = $(oAlert).innerHeight() / 2;
                midWidth = width / 2;
                oAlert.style.marginTop = -midHeight - _default.startPos + 'px';
                oAlert.style.marginLeft = -midWidth + 'px';
                $(oAlert).stop(0, 1).animate({
                    'margin-top': -midHeight,
                    'opacity': 1
                }, _default.animateTime);
                $('body').append('<div id="DialogMask" class="PopMask" style="height: ' + $(window).height() + 'px; z-index: 100;"></div>');
                $('#DialogMask').fadeIn(600);
                $('body').unableIScroll();
                oConfirm.bind('fastclick', function () {
                    hideLayout(_default.onConfirm, $(this));
                });
                oCancel.bind('fastclick', function () {
                    hideLayout(_default.onCancel, $(this));
                });
                function hideLayout(fn, e) {
                    $(oAlert).animate({
                        'margin-top': -midHeight - _default.startPos,
                        'opacity': 0
                    }, _default.animateTime, function () {
                        $(this).remove();
                        $('#DialogMask').fadeOut(600).remove();
                        $.isShowAlert = false;
                        $('body').unIScroll();
                        fn && fn.call(window, e);
                    });
                }
            }
        },
        //显示加载提示框
        /*
         * @param text 显示文本(直接量)
         * Type:{String}
         * 可直接写$.loadingFadeIn('显示文本')
         *
         * @param onCancel 按下取关闭钮回调函数 --> window
         * Type:{Function}
         *
         */
        loadingFadeIn: function () {
            if (!$.isShowAlert) {
                $.isShowAlert = true;
                var _default = {
                    text: '加载中',
                    closeCallback: null
                };
                if (typeof arguments[0] == 'string' && (typeof arguments[1] == 'Number' || arguments[1] == null)) {
                    _default.text = arguments[0];
                    _default.closeCallback = arguments[1];
                }
                else if (typeof arguments[0] == 'object') {
                    _default = $.extend(_default, arguments[0]);
                }
                var oAlert = document.createElement('div');
                oAlert.className = 'cui-grayload-text laodingAlert';
                oAlert.id = 'js_locating';
                oAlert.innerHTML = '<div class="cui-i cui-w-loading"></div>\
                <div class="cui-i cui-m-logo"></div>\
                <div class="cui-grayload-close" id="js_locating_close"></div>\
                <div class="cui-grayload-bfont">定位中...</div>';
                $('body').append(oAlert);
                oCancel = $('#js_locating_close');
                oAlert.style.zIndex = 101;
                oAlert.style.display = 'block';
                $('body').append('<div id="DialogMask" class="PopMask" style="height: ' + $(window).height() + 'px; z-index: 100;"></div>');
                $('#DialogMask').fadeIn(600);
                $('body').unableIScroll();
                oCancel.bind('fastclick', function () {
                    hideLayout(_default.closeCallback);
                });
                function hideLayout(fn) {
                    $(oAlert).remove();
                    $('body').unIScroll();
                    $.isShowAlert = false;
                    $('#DialogMask').fadeOut(600).remove();
                    fn && fn.call(window);
                }
            }
        },
        //隐藏加载提示框
        /*
         * @param fn 关闭后回调函数 --> window
         * Type:{Function}
         *
         */
        loadingFadeOut: function (fn) {
            if ($.isShowAlert) {
                $('#js_locating').remove();
                $('body').unIScroll();
                $.isShowAlert = false;
                $('#DialogMask').fadeOut(600).remove();
                fn && typeof fn === 'function' && fn.call(window);
            }
        },
        //显示二级详细页面
        /*
         * @param name 要显示该控件的data-rel属性
         * Type:{String}
         *
         */
        detailPopShow: function (name) {
            var _wrap = $('.detail_pop_wrap[data-rel=' + name + ']');
            var _article = $('#mainContent');
            var _titleCont = $('#header');
            _article.css('display', 'none');
            var _detailHead = $('.headerDetail[data-rel=' + name + ']');
            var _default = _wrap[0].default || null;
            _wrap.css('display', 'block');
            _detailHead.css('display', 'block');
            _titleCont.css('display', 'none');
            _detailHead.find('.RIghtText').css('display', _default.isButton ? 'block' : 'none');
            _default && _default.openCallback && _default.openCallback.call(window, _wrap, _detailHead, $());
        },
        //隐藏二级详细页面
        /*
         * @param name 要隐藏该控件的data-rel属性
         * Type:{String}
         *
         */
        detailPopHidden: function (name) {
            var _wrap = $('.detail_pop_wrap[data-rel=' + name + ']');
            var _detailHead = $('.headerDetail[data-rel=' + name + ']');
            var _article = $('#mainContent');
            var _titleCont = $('#header');
            var _default = _wrap[0].default || null;
            _wrap.css('display', 'none');
            _detailHead.css('display', 'none');
            _titleCont.css('display', 'block');
            _article.css('display', 'block');
            _default && _default.closeCallback && _default.closeCallback.call(window, _wrap, _detailHead, $());
        }
    });
    /*右栏弹出插件*/
    /*
     * @param searchInput 指定搜索框
     * Type:{jQuery}
     *
     * @param searchBotton 指定搜索按钮
     * Type:{jQuery}
     *
     * @param width 右侧画面占屏幕像素
     * Type:{Number}
     *
     */
    $.fn.rightCont = function (opts) {

        var _default = {
            searchInput: $('#searchInput'),
            searchBotton: $('#searchBotton'),
            width: $(window).width() / 6 * 5
        };
        _default = $.extend(_default, opts);
        var rightWidth = Math.floor(_default.width);
        var pageCont = $('div[data-role=page]');
        var _this = this;
        _this[0].activeSate = _this[0].activeSate || 0;
        !$(this)[0].activeSate && trigger(_this);
        $('#rgWrapper').css({
            'width': rightWidth,
            'right': -rightWidth
        });

        _default.searchInput.bind('focus', function () {
            $(this).bind('keyup', function () {
                _default.searchBotton.css('display', ($(this).val().length ? 'block' : 'none'));
                $(this).iScrollRefresh();
            })
        });
        function trigger(e) {
            e.bind('fastclick', function () {
                $('#PopMaskRightCont').length || $('body').append('<div id="PopMaskRightCont" class="PopMask" style="position:absolute;height: ' + $(window).height() + 'px; display: none; z-index: 100;"></div>');
                $.hideBottomLayout();
                $('#rgWrapper .listSuggestCont').iScroll({
                    listHeight: $(window).height() - 116
                });
                $('header:eq(0)').animate({
                    'left': -rightWidth
                }, 300);
                pageCont.css({
                    'position': 'relative',
                    'overflow': 'hidden'
                }).animate({
                    'margin-left': -rightWidth,
                    'margin-right': rightWidth
                }, 300, showRightContAfter);
                $('#rgWrapper').css({}).animate({
                    'right': 0
                }, 300, function () {
                    _default.searchInput.focus();
                });
                return 0;
            });
        }

        function showRightContAfter() {
            $('#PopMaskRightCont').css({
                display: 'block',
                top: $(window).scrollTop(),
                width: $(window).width() - rightWidth
            }).addClass('rg-cont-mask').bind('fastclick', function () {
                $(this).remove();
                $('header:eq(0)').animate({
                    'left': 0
                }, 300);
                pageCont.css({
                    'position': 'relative'
                }).animate({
                    'margin-left': 0,
                    'margin-right': 0,
                    'overflow': 'auto'
                }, 300, hideRightContAfter);

                $('#rgWrapper').css({}).animate({
                    'right': -rightWidth
                }, 300);
                return 0;
            });
            $('#TourFooter').animate({
                'bottom': -48
            }, 300, function () {
                $('#BottomNav>li').removeActive();
            });
            $('body').unableIScroll();
            _this[0].activeSate = 1;
        }

        function hideRightContAfter() {
            $('#TourFooter').animate({
                'bottom': 0
            }, 300);
            $('header:eq(0)').css({
                'position': 'fixed'
            });
            $('body').unIScroll();
            _this[0].activeSate = 0;
        }

        return this;
    };
    /*滚动插件绑定*/
    /*
     * @param wrapper 滚动范围
     * Type:{jQuery}
     *
     * @param scrollCont 滚动区域
     * Type:{jQuery}
     *
     * @param listHeight 滚动范围高度
     * Type:{Number}
     *
     */
    $.fn.iScroll = function (opts) {
        var _default = {
            wrapper: this.parent(),
            scrollCont: this.children().eq(0),
            listHeight: this.parent().height()
        };
        _default = $.extend(_default, opts);

        this[0].style.overflow = 'hidden';
        this[0].style.maxHeight = _default.listHeight + 'px';
        _default.wrapper[0].style.maxHeight = _default.listHeight + 'px';
        if (_default.listHeight < _default.scrollCont.height() && window.IScroll) {
            this[0].iScroll = new IScroll(this[0], {mouseWheel: 1, scrollbars: 0});
        }
        return this;
    };
    /*滚动插件刷新*/
    /*
     *更新滚动范围
     */
    $.fn.iScrollRefresh = function () {
        this[0].iScroll && this[0].iScroll.refresh();
        return this;
    };
    /*滚动插件解绑*/
    $.fn.unIScroll = function () {
        this[0].iScroll && this[0].iScroll.destroy();
        if (this[0]._unableIScroll) {
            console.log(this[0]._unableIScroll);
            this[0].removeEventListener('touchmove', this[0]._unableIScroll, false);
            this[0]._unableIScroll = null;
        }
        return this;
    };
    /*滚动插件禁用*/
    $.fn.unableIScroll = function () {
        var _this = this[0] || {};
        if (!_this._unableIScroll) {
            _this._unableIScroll = function (e) {
                e.preventDefault && e.preventDefault();
            };
            _this.addEventListener && _this.addEventListener('touchmove', _this._unableIScroll, false);
        }
        return this;
    };
    /*
     *筛选弹出框绑定插件
     * 参数
     * @param trigger 绑定触发元素(更改状态后元素添加new类)
     * Type:{jQuery}
     *
     * @param resetBtn 绑定重置按钮元素
     * Type:{jQuery}
     *
     * @param resetBtn 绑定重置按钮元素
     * Type:{DOMElement, jQuery, Object}
     *
     * @param initialCallback 执行初始化后回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param handler对象[1]
     ** Type:{Object}
     *
     *
     * @param confirmCallback 确定按钮按下后回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param elem 确定按钮
     ** Type:{DOMElement}
     **
     ** @param boxContObject  该筛选项所有被选择项的数组
     ** Type:{Array}
     ** @param handler对象[1]
     ** Type:{Object}
     *
     * @param resetCallback 重置按钮按下后回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param elem 重置按钮
     ** Type:{DOMElement}
     *
     * @param cancelCallback 取消按钮按下后回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param elem 取消按钮
     ** Type:{DOMElement}
     *
     *
     * @param onItemsTap 筛选项按钮按下后回调函数 --> $(this)控件本身
     * Type:{Function}(elem,index,val)
     ** @param elem 选中的DOM元素
     ** Type:{DOMElement}
     ** @param index 选中的筛选项序号
     ** Type:{Number}
     ** @param val 选中的筛选项的值
     ** Type:{String}
     *
     *  handler对象[1]
     ** handler.values  该筛选项所有被选择项的数组
     ** Type:{Array}
     **
     ** handler.values[i].key 该筛被选择项i的序号
     ** Type:{Number}
     **
     ** handler.values[i].key 该筛被选择项i的值
     ** Type:{String}
     **
     ** handler.values[i].valueText 该筛被选择项i的文本
     ** Type:{String}
     *
     ** handler.selectSingleItemAndConfirm 强制选择某个选项然后隐藏控件
     ** Type:{Function}
     ** return:void
     **
     *
     */
    $.fn.boxContentInital = function (opts) {
        var _default = {
            trigger: $(),
            resetBtn: $('#btn_reset'),
            initialCallback: null,
            confirmCallback: null,
            resetCallback: null,
            cancelCallback: null,
            onItemsTap: null
        };

        _default = $.extend(_default, opts);
        var selectNum = this.find('.selectCont').length;
        var _this = this;
        var bottomBtn = $(_default.trigger) || $();
        var handler = {};
        _default.resetBtn = $(_default.resetBtn);
        handler.values = this[0].boxContObject = [];
        this[0].selectNum = selectNum;
        for (var i = 0; i < selectNum; i++) {
            this[0].boxContObject.push({key: 0, value: 'no-set'});
        }
        this[0].selectSingleItemAndConfirm=handler.selectSingleItemAndConfirm = function (target) {
            selectSingleItem(target);
            itemsConfirm();
        };
        function itemsConfirm() {
            var select, result = 0;
            for (var i = 0; i < selectNum; i++) {
                select = _this.find('.selectCont:eq(' + i + ')');
                _this[0].boxContObject[i].key = select.find('.CurrentSelect').index() - 1;
                _this[0].boxContObject[i].value = select.find('input[type=hidden]').val();
                _this[0].boxContObject[i].valueText = select.find('.CurrentSelect').text();
                result += _this[0].boxContObject[i].key
            }
            result === 0 ? bottomBtn.removeClass('new') : bottomBtn.addClass('new');
        }

        function selectSingleItem(target) {
            var val = target.addClass('CurrentSelect').attr('data-key');
            var index = target.index() - 1;
            target.siblings('dd').removeClass('CurrentSelect');
            target.siblings('input[type=hidden]').val(val);
            if (_this.find('.notSet.CurrentSelect').length !== selectNum) {
                _default.resetBtn.removeClass('disable');
            } else {
                _default.resetBtn.addClass('disable');
            }
            _default.onItemsTap && _default.onItemsTap.call(_this, $(_this)[0], index, val);
        };

        this.find('dd').bind('fastclick', function () {
            selectSingleItem($(this));
            return 0;
        });
        _default.resetBtn.bind('fastclick', function () {
            _this.find('input[type=hidden]').val('not-set');
            _this.find('.selectCont dd').removeClass('CurrentSelect');
            _this.find('.selectCont').find('dd:eq(0)').addClass('CurrentSelect');
            $(this).addClass('disable');
            _default.resetCallback && _default.resetCallback.call(_this, $(this)[0]);
            return 0;
        });
        this.find('.btn_cancel a').bind('fastclick', function () {
            $.hideBottomLayout({
                callback: deActive
            });
            _default.cancelCallback && _default.cancelCallback.call(_this, $(this)[0]);
            return 0;
        });

        this.find('.btn_confirm a').bind('fastclick', function () {
            $.hideBottomLayout({
                callback: deActive
            });
            itemsConfirm();

            _default.confirmCallback && _default.confirmCallback.call(_this, $(this)[0], _this[0].boxContObject, handler);

            return 0;
        });

        if (this.find('.BoxContent:eq(0)').length) {
            this.find('.BoxContent:eq(0)').iScroll({
                listHeight: Math.floor($(window).height() - (94 + parseInt(this.css('bottom'))))
            });
        }

        _default.initialCallback && _default.initialCallback.call(_this, handler);

        function deActive() {
            _default.trigger.removeActive();
        }

        return this;
    };
    $.fn.refresh = function () {
        if (this[0].boxContObject) {
            var resetBtn = $('#btn_reset');
            var key;
            for (var i = 0; i < this[0].boxContObject.length; i++) {
                key = this[0].boxContObject[i].key;
                select = this.find('.selectCont:eq(' + i + ')');
                select.find('dd:eq(' + key + ')').addClass('CurrentSelect').siblings('.CurrentSelect').removeClass('CurrentSelect');
            }
            if (this.find('.notSet.CurrentSelect').length !== this[0].selectNum) {
                resetBtn.removeClass('disable');
            } else {
                resetBtn.addClass('disable');
            }
        }
        return this;
    };
    /*
     *日期修改插件datePicker
     * 参数
     * @param trigger 绑定触发元素
     * Type:{jQuery}
     *
     * @param startDate 设置开始日期
     * Type:{Date}
     *
     * @param maxDate 可查询最大范围日期（日为单位） 若无，则设置为0
     * Type:{Number}
     *
     * @param confirm 绑定确认按钮
     * Type:{jQuery}
     *
     * @param startDateSelect 绑定选择开始日期的按钮
     * Type:{jQuery}
     *
     * @param rangeDateSelect 绑定选择日期范围的按钮
     * Type:{jQuery}
     *
     * @param confirmCallback 确定按钮按下后回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param elem 确定按钮
     ** Type:{DOMElement}
     ** @param trigger 触发元素
     ** Type:{jQuery}
     ** @param time对象[1]*
     ** Type:{Object}
     *
     * @param initialCallback 初始化后回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param trigger 触发元素
     ** Type:{jQuery}
     ** @param time对象[1]*
     ** Type:{Object}
     *
     *
     *  time对象[1]*
     ** time.maxDate  当前可查询最大范围日期（日为单位）
     ** Type:{Number}
     **
     ** time.startDate  当前开始日期
     ** Type:{Date}
     **
     ** time.departDate  当前结束日期
     ** Type:{Date}
     **
     ** time.inDay  当前查询范围（日为单位）
     ** Type:{Number}
     **
     ** time.printDate  输出日期格式（日为单位）
     ** Type:{Function}
     ** return:{String}
     ** @param date 要输出的日期
     ** Type:{Date}
     ** @param isFormat 格式选择（5月11日为例） ture:返回5月11日 false:返回 今天/明天/后天
     ** Type:{Boolean}
     **
     ** time.printDay  输出日期格式（星期数）如：周一/周二/周日
     ** Type:{Function}
     ** return:{String}
     ** @param date 要输出的日期
     ** Type:{Date}
     **
     ** time.printFormat  输出日期标准格式 如：2015-05-11
     ** Type:{Function}
     ** return:{String}
     ** @param dates 要输出的日期
     ** Type:{Date}
     **
     */
    $.fn.datePickerInital = function (opts) {
        var _default = {
            trigger: $(),
            startDate: new Date(),
            maxDate: 0,
            confirm: $('#confirm'),
            startDateSelect: $('.hotel-numitmes'),
            rangeDateSelect: $('.hotel-day'),
            confirmCallback: null,
            initialCallback: null
        };

        _default = $.extend(_default, opts);
        var _this = $(this);
        var _curDate = new Date();
        setZeroTime(_curDate);
        var _starDateRange = 0;
        var time = {};
        time.maxDate = _default.maxDate;
        time.startDate = _default.startDate;
        var _startNext = _default.startDateSelect.find('[data-id=next]');
        var _startPre = _default.startDateSelect.find('[data-id=pre]');

        //设置离店日期
        time.departDate = new Date();
        setZeroTime(_default.startDate);
        //设置住宿日期
        var _dayMillStatic = 86400000;
        var _dayMill = _dayMillStatic;
        time.inDay = 1;
        time.departDate.setTime(_default.startDate.getTime() + _dayMill * time.inDay);

        //智能日期输出
        time.printDate = function (date, isFormat) {
            isFormat = isFormat || false;
            if (!isFormat) {
                var isMouthYear = date.getMonth() === _curDate.getMonth() && date.getFullYear() === _curDate.getFullYear();
                if (date.getDate() === _curDate.getDate() && isMouthYear) {
                    return '今天';
                }
                else if (date.getDate() - 1 === _curDate.getDate() && isMouthYear) {
                    return '明天';
                }
                else if (date.getDate() - 2 === _curDate.getDate() && isMouthYear) {
                    return '后天';
                }
            }
            return (date.getMonth() + 1) + '月' + date.getDate() + '日';
        };
        //周输出
        time.printDay = function (date) {
            return '周' + '日一二三四五六'.substr(date.getDay(), 1);
        };
        time.printFormat = function (dates) {
            var month = dates.getMonth() + 1;
            var date = dates.getDate();
            return dates.getFullYear() + '-' + (month > 10 ? month : '0' + month) + '-' + ((date + 1) > 10 ? date : '0' + date);
        };

        //更新日期
        _this[0].refreshDate = function (_num) {
            if (!checkdayRange() && /disable/.test(_startNext.attr('class'))) {
                $.simpleAlert('查询日期不可超过' + time.maxDate + '日');
            }
            time.inDay = _num || time.inDay;
            _this.find('.js_inday_main_title').text(time.printDate(_default.startDate));
            _this.find('.js_inday_sub_title').text(time.printDate(_default.startDate, true) + '(' + time.printDay(_default.startDate) + ')');
            _this.find('.js_outday_sub_title').text(time.printDate(time.departDate, true) + '(' + time.printDay(time.departDate) + ')');
            _this.find('.js_outday_main_title').text('住' + time.inDay + '晚');
            checkstartDateBtn();

            if (time.maxDate) {
                _default.rangeDateSelect[0].maxVal = time.maxDate - _starDateRange;
                _default.rangeDateSelect[0].minVal = 1;
                _default.rangeDateSelect[0].refresh();
            }
        };

        //住房天数框绑定
        if (time.maxDate) {
            _default.rangeDateSelect.attr('data-max', time.maxDate + 1);
        }
        _default.rangeDateSelect.inputNumber({
            isShowVal: false,
            callback: function (num, maxVal, minVal) {
                _dayMill = num * _dayMillStatic;//TODO mark callback
                time.departDate.setTime(_default.startDate.getTime() + _dayMill);
                _this[0].refreshDate(num);
            }
        });

        //默认显示入住日期
        _this[0].refreshDate();
        //初始化执行
        _default.initialCallback && _default.initialCallback.call(_this, _default.trigger, time);

        //设置隐藏域值
        setTimeResultHiddenInput(_default.trigger.find('#startDate'),_default.startDate);
        setTimeResultHiddenInput(_default.trigger.find('#departDate'),time.departDate);


        //确定按钮
        _default.confirm.bind('fastclick', function () {

            $.hideBottomLayout({
                callback: deActive
            });
            setTimeResultHiddenInput(_default.trigger.find('#startDate'),_default.startDate);
            setTimeResultHiddenInput(_default.trigger.find('#departDate'),time.departDate);
            //setTriggerTag();
            _default.confirmCallback && _default.confirmCallback.call(_this, $(this)[0], _default.trigger, time);
            return 0;
        });

        //入住日期按钮加减
        _startNext.bind('fastclick', function () {
            bindInputTap.call($(this), 1);
        });
        _startPre.bind('fastclick', function () {
            bindInputTap.call($(this), 0);
        });
        function bindInputTap(_type) {
            if (time.maxDate) {
                if (checkdayRange()) {
                    if (_type) {
                        _starDateRange++;
                        _default.startDate.setTime(_default.startDate.getTime() + _dayMillStatic);
                        time.departDate.setTime(_default.startDate.getTime() + _dayMill);
                    }
                }
            } else {
                if (_type) {
                    _starDateRange++;
                    _default.startDate.setTime(_default.startDate.getTime() + _dayMillStatic);
                    time.departDate.setTime(_default.startDate.getTime() + _dayMill);
                }
            }
            if (_starDateRange > 0) {
                if (!_type) {
                    _starDateRange--;
                    _default.startDate.setTime(_default.startDate.getTime() - _dayMillStatic);
                    time.departDate.setTime(_default.startDate.getTime() + _dayMill);
                }
            }
            _this[0].refreshDate();
        }

        function checkstartDateBtn() {
            _starDateRange > 0 ? _startPre.removeClass('disabled') : _startPre.addClass('disabled');
            //console.log(checkdayRange());
            time.maxDate && (checkdayRange() ? _startNext.removeClass('disabled') : _startNext.addClass('disabled'));
        }

        function checkdayRange() {
            return _curDate.getTime() + time.maxDate * _dayMillStatic - time.departDate.getTime() > 0;
        }

        function setTimeResultHiddenInput(e,date) {
            e.val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
        }

        //移除激活状态
        function deActive() {
            _default.trigger.removeActive();
        }

        //设置日期整数
        function setZeroTime(date) {
            date instanceof Date && date.setHours(0, 0, 0, 0);
        }

        return this;
    };

    /*数量选选项框事件插件
     *参数
     * @param isShowVal 是否显示数字框
     * Type:{Boolean}
     *
     * @param plusCallback 按增加按钮时的回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param thisVal 当前数量
     ** Type:{Number}
     ** @param maxVal 当前最大值
     ** Type:{Number}
     ** @param minVal 当前最小值
     ** Type:{Number}
     *
     * @param minusCallback 按减少按钮时的回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param thisVal 当前数量
     ** Type:{Number}
     ** @param maxVal 当前最大值
     ** Type:{Number}
     ** @param minVal 当前最小值
     ** Type:{Number}
     *
     * @param callback 数量变化时的回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param thisVal 当前数量
     ** Type:{Number}
     ** @param maxVal 当前最大值
     ** Type:{Number}
     ** @param minVal 当前最小值
     ** Type:{Number}
     *
     * */
    $.fn.inputNumber = function (opts) {
        var _default = {
            isShowVal: true,
            plusCallback: null,
            minusCallback: null,
            callback: null
        };
        _default = $.extend(_default, opts);
        var _this=$(this);
        _this.each(function(i,e){
            var __this = $(e);
            var handler={
                target:__this,
                //_thisValInput : $(e).parent().find('.inputText'),
                _thisMinus : $(e).parent().find('.minus'),
                _thisAdd : $(e).parent().find('.add'),
                _thisVal : 0,//parseInt($(e).parent().find('.inputText').val()),
                _add : $(e).find('.add:eq(0)'),
                _minus : $(e).find('.minus:eq(0)'),
                _value : $(e).find('.inputText:eq(0)'),
                bindName : $(e).attr('data-bind'),
                minVal:parseInt($(this).attr('data-min')) || 0,
                maxVal:parseInt($(this).attr('data-max')) || null,
                refresh: function () {
                    handler.minVal=$(e)[0].minVal;
                    handler.maxVal=$(e)[0].maxVal;
                    handler._thisVal=$(e)[0].value;

                    handler._value.val(handler._thisVal);
                    handler._thisVal > handler.minVal ? handler._thisMinus.removeClass('invalid') :handler._thisMinus.addClass('invalid');
                    handler.maxVal && (handler.maxVal > handler._thisVal ? handler._thisAdd.removeClass('invalid') : handler._thisAdd.addClass('invalid'));
                }
            };
            $(e)[0].refresh = handler.refresh;
            $(e)[0].value = handler._thisVal = handler.minVal;
            handler._value.val(handler._thisVal);

            if (!_default.isShowVal) {
                __this.addClass('hiddenVal');
            }
            if (parseInt(handler._value.val()) > 0) {
                handler._value.addClass('');
            }
            bindInputTap.call(e,__this,handler, 0);
            handler._add.bind('fastclick', function () {
                bindInputTap.call(e,__this,handler, 1);
                _default.plusCallback && _default.plusCallback.call($(__this), handler._thisVal, handler.maxVal, handler.minVal);
            });
            handler._minus.bind('fastclick', function () {
                bindInputTap.call(e,__this,handler, 0);
                _default.minusCallback && _default.minusCallback.call($(__this), handler._thisVal, handler.maxVal, handler.minVal);
            });
        });
        function bindInputTap(e,handler,_type) {
            $(e)[0].minVal=handler.minVal;
            $(e)[0].maxVal=handler.maxVal;
            $(e)[0].refresh=handler.refresh;
            $(e)[0].value=handler._thisVal;
            if (handler.maxVal) {
                if (handler.maxVal > handler._thisVal) {
                    _type && $(e)[0].value++;
                }
            } else {
                _type && $(e)[0].value++;
            }
            if (handler._thisVal > handler.minVal) {
                _type || $(e)[0].value--;
            }
            //handler._thisValInput.val(handler._thisVal);

            handler.refresh();
            $('#' + handler.bindName).val(handler._thisVal);
            _default.callback && _default.callback.call(handler.target, handler._thisVal, handler.maxVal, handler.minVal);
        }

        return this;
    };

    //点击跳转
    $.fn.switcherHref = $.fn.tapToHref = function (opts) {
        var _default = {
            beforeRedirect:null
        };
        _default = $.extend(_default, opts);
        var result;
        $(this).bind('fastclick', function () {
            if ($(this).attr('data-href')){
                _default.beforeRedirect && (result = _default.beforeRedirect.call($(this)));
                if (!result && result !== undefined) {
                    return false;
                }
                document.location.href = $(this).attr('data-href');
            }


        });
        return this;
    };
    //显示底部对话框
    /*
     *默认触发器与对话框的data-rel属性必须相同!!
     * 参数
     * @param callback 触发器击回调函数
     * Type:{Object,Function}( Boolean state, Object(DOM) wrap )
     ** @param state 触发器开关状态 true开 false关
     ** Type:{Boolean}
     ** @param wrap 当前显示层元素
     ** Type:{DOMElement}
     *
     * @param hiddenCallback 隐藏界面回调函数 --> window
     * Type:{Function}
     *
     * @param isAnimate 是否添加动画
     * Type:{Boolean}
     *
     * @param animateTime 动画时间
     * Type:{Number}
     *
     * */
    $.fn.displayWrap = function (opts) {
        var _default = {
            callback: null,
            isAnimate: true,
            animateTime: 300,
            hiddenCallback: null
        };
        _default = $.extend(_default, opts);

        this.each(function () {

            $(this).bind('fastclick', function (e) {

                $(this)[0].activeSate = $(this)[0].activeSate || false;
                var rel = $(this).attr('data-rel');
                var wrap = $(this)[0].activeWrap = $('.filter_pop_wrap[data-rel=' + rel + ']');
                var trigger = $(this);
                wrap[0].trigger=trigger[0];
                var wrapPos = parseInt(wrap.css('bottom'));

                if (!$(this)[0].activeSate) {
                    $(this).addClass('active');

                    if (!$('#PopMaskWrap').length) {
                        $('body').append('<div id="PopMaskWrap" class="PopMask" style="height: ' + $(window).height() + 'px; display: none; z-index: 98;"></div>');
                        $('#PopMaskWrap').bind('fastclick', function () {
                            layoutHidden();
                        });
                    }
                    $('#PopMaskWrap').css({
                        display: 'block',
                        'z-Index': 97
                    });
                    $('body').unableIScroll();

                    wrap.css({'visibility': 'visible', 'bottom': -wrap.innerHeight(), 'z-index': 98});
                    _default.callback && _default.callback.call(trigger[0], trigger[0].activeSate, wrap[0]);
                    trigger[0].activeSate = true;
                    wrap.animate({
                        'bottom': wrapPos
                    }, _default.isAnimate ? _default.animateTime : 0);
                } else {
                    layoutHidden();
                }
                function layoutHidden() {
                    //$('body').unIScroll();
                    $.hideBottomLayout({
                        callback: function () {
                            trigger.removeActive();
                            _default.hiddenCallback && _default.hiddenCallback.call(window);
                        }
                    });
                    //$('#PopMaskWrap').remove();
                }
            });
        });
        return this;
    };
    //去除点击状态插件
    $.fn.removeActive = function () {
        this.each(function () {
            $(this).removeClass('active')[0].activeSate = false;
        });
    };
    //列表选择栏
    /*
     * 参数
     * @param trigger 绑定触发元素
     * Type:{jQuery}
     *
     * @param maxHeight 定义列表界面最高高度
     * Type:{Number}
     *
     * @param onListsTap 选项触发事件回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param elem 当前选择元素
     ** Type:{DOMElement}
     ** @param index 当前选择元素的序号
     ** Type:{Number}
     ** @param value 当前选择元素的值
     ** Type:{String}
     *
     * */
    $.fn.simpleListInital = function (opts) {
        var _default = {
            trigger: $(),
            maxHeight: Math.floor($(window).height() * 0.5),
            onListsTap: null,
            initialCallback:null
        };
        _default = $.extend(_default, opts);
        var _this = this;
        var handle={
            trigger:_default.trigger,
            elem:null,
            key:0,
            val:undefined,
            selectTap:function(index){
                //$(this).find('.simpleListRoll').find('li')
                selectItem(_this,index)
            }
        };
        _this[0].handle=handle;
        this.each(function () {
            var roll = $(this).find('.simpleListRoll');
            roll.iScroll({
                listHeight: _default.maxHeight
            });
            $(this).find('.simpleListRoll').find('li').each(function () {

                $(this).bind('fastclick', function () {
                    $(this).append('<i class="animate_select"></i>').siblings('li').find('i.animate_select').remove();
                    $.hideBottomLayout({
                        callback: function () {
                            _default.trigger && (_default.trigger.removeClass('active')[0].activeSate = 0);
                        }
                    });
                    if (_default.trigger)
                        $(this).index() ? _default.trigger.addClass('new') : _default.trigger.removeClass('new');
                    handle.elem=$(this);
                    handle.key=$(this).index();
                    handle.val=$(this).attr('data-key');
                    _default.onListsTap && _default.onListsTap.call(_this, $(this)[0], $(this).index(), $(this).attr('data-key'));
                })
            });
            //handle.selectTap(0);
            _default.initialCallback && _default.initialCallback.call($(this),handle)
        });
        function selectItem(e,index){
            var item=$(e).find('.simpleListRoll').find('li:eq('+index+')');
               /* $(this).bind('fastclick', function () {*/
            item.append('<i class="animate_select"></i>').siblings('li').find('i.animate_select').remove();
            handle.elem=item;
            handle.key=index;
            handle.val=item.attr('data-key');
            _default.onListsTap && _default.onListsTap.call(_this, e, index, item.attr('data-key'));
        }
        return this;
    };
    //显示清空按钮的文本框插件
    /*
     * 参数
     * @param isArrow 文本框是否出现向右箭头
     * Type:{Boolean}
     *
     * @param onfocusCallback 文本框输入状态时回调函数 --> $(this)控件本身
     * Type:{Function}
     *
     * @param onBlurCallback 文本框失焦状态时回调函数 --> $(this)控件本身
     * Type:{Function}
     *
     * */
    $.fn.inputText = function (opts) {
        var _default = {
            isArrow: false,
            onfocusCallback: null,
            onBlurCallback: null
        };
        _default = $.extend(_default, opts);
        var _clearInput, _input;

        this.each(function () {
            var _this = $(this);
            _input = _this.find('input:eq(0)');
            _clearInput = _this.find('.clearInput');
            _this.addClass('inputText');
            if (_default.isArrow) {
                _this.addClass('InputArrow');
            }
            _input.bind('focus', function () {
                var input = _this.find('input:eq(0)');
                input.val().length ? _this.addClass('nonEmpty') : _this.removeClass('nonEmpty');
                $(this).bind('keyup', function () {
                    input.val().length ? _this.addClass('nonEmpty') : _this.removeClass('nonEmpty');
                });
                _default.onfocusCallback && _default.onfocusCallback.call(_this);
            });
            _input.bind('blur', function () {
                _this.removeClass('nonEmpty');
                _default.onBlurCallback && _default.onBlurCallback.call(_this);
            });
            _clearInput.bind('fastclick', function () {
                _this.find('input:eq(0)').val('')[0].focus();
                _this.removeClass('nonEmpty');
            });
        });

        return this;
    };
    //详细二级页面插件
    /*
     *默认触发器与对话框的data-rel属性必须相同!!
     * 参数
     * @param title 二级页面标题
     * Type:{String}
     *
     ** @param isButton 是否出现右侧按钮 true开 false关
     ** Type:{Boolean}
     *
     ** @param buttonText 按钮文本
     ** Type:{String}
     *
     ** @param initialCallback 初始化后的回调函数 --> $(this)控件本身
     ** Type:{Function}
     ** @param wrap 该页面本身
     ** Type:{jQuery}
     ** @param head 该页面标题对象
     ** Type:{jQuery}
     ** @param trigger 触发元素(控件本身)
     ** Type:{jQuery}
     ** @param handler handler对象[1]*
     ** Type:{Object}
     *
     ** @param firstOpenCallback 第一次打开后的回调函数,第二次打开不触发此函数 --> $(this)控件本身
     ** Type:{Function}
     ** @param wrap 该页面本身
     ** Type:{jQuery}
     ** @param head 该页面标题对象
     ** Type:{jQuery}
     ** @param trigger 触发元素(控件本身)
     ** Type:{jQuery}
     ** @param handler handler对象[1]*
     ** Type:{Object}
     *
     ** @param openCallback 点击触发的回调函数 --> $(this)控件本身
     ** Type:{Function}
     ** @param wrap 该页面本身
     ** Type:{jQuery}
     ** @param head 该页面标题对象
     ** Type:{jQuery}
     ** @param trigger 触发元素(控件本身)
     ** Type:{jQuery}
     ** @param handler handler对象[1]*
     ** Type:{Object}
     *
     * @param closeCallback 关闭触发的回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param wrap 该页面本身
     ** Type:{jQuery}
     ** @param head 该页面标题对象
     ** Type:{jQuery}
     ** @param elem 关闭按钮对象
     ** Type:{jQuery}
     ** @param handler handler对象[1]*
     ** Type:{Object}
     *
     * @param buttonCallback 点击右侧按钮触发的回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param wrap 该页面本身
     ** Type:{jQuery}
     ** @param head 该页面标题对象
     ** Type:{jQuery}
     ** @param elem 右侧按钮对象
     ** Type:{jQuery}
     ** @param handler handler对象[1]*
     ** Type:{Object}
     *
     *  handler对象[1]*
     ** handler.hiddenWrap  隐藏页面
     ** Type:{Number}
     ** @param wrap 要隐藏的页面
     ** Type:{jQuery}
     *
     * */
    $.fn.detailPop = function (opts) {
        var _default = {
            title: '详细页面标题',
            isButton: false,
            buttonText: '按钮',
            'initialCallback': null,
            'firstOpenCallback': null,
            'openCallback': null,
            'beforeOpenCallback': null,
            'closeCallback': null,
            'buttonCallback': null
        };
        _default = $.extend(_default, opts);
        //var _this = $(this);
        var _article = $('#mainContent');
        var _titleCont = $('#header');
        var _button,relHead,rel;
        var handler = {};
        var bodyScroll=0;
        //var relHead=$('.headerDetail');

        handler.hiddenWrap = function (_wrap) {
            _wrap.css('display', 'none');
            _article.css('display', 'block');
            relHead.css('display', 'none');
            _titleCont.css('display', 'block');
            $('body').scrollTop(bodyScroll);
        };
        this.each(function (i,e) {
            //rel = $(e).attr('data-rel');
            var _this=$(e);
            rel=$(e).attr('data-rel');
            var wrap = $('.detail_pop_wrap[data-rel=' + rel + ']');
            relHead = $('.headerDetail[data-rel=' + rel + ']').eq(0);
            if (!relHead.length) {
                var detailHead = document.createElement('div');
                detailHead.setAttribute('data-rel', rel);
                detailHead.className = 'HeaderView headerDetail';
                detailHead.innerHTML = '<h1>' + _default.title + '</h1><i class="ReturnIco"></i><i class="RIghtText">' + _default.buttonText + '</i>';
                _titleCont.after(detailHead);
                relHead=$(detailHead);
            }
            $(e).bind('fastclick', function () {
                var _rel=$(this).attr('data-rel');
                var _wrap = $('.detail_pop_wrap[data-rel=' + _rel + ']');
                var _relHead = $('.headerDetail[data-rel=' + _rel + ']');


                _default.isButton && (_button = $(_relHead).find('.RIghtText'));

                _wrap[0].default = _default;

                if(arguments.callee.times!==undefined){
                    arguments.callee.times++;
                }else{
                    arguments.callee.times=1;
                    //$('.inputText').inputText();
                    _default.firstOpenCallback && _default.firstOpenCallback.call($(e), _wrap, _relHead, $(this), handler);
                }
                openWindowFn(_this, _rel, _wrap);
                _relHead.find('.ReturnIco').bind('fastclick', function () {
                    if($.detailPopInfo.isOpen){
                        var result;
                        $.hideBottomLayout();
                        _default.closeCallback && (result = _default.closeCallback.call($(this), $.detailPopInfo.wrap, $.detailPopInfo.head,$.detailPopInfo.trigger, handler));
                        if (!result && result !== undefined) {
                            return false;
                        }
                        handler.hiddenWrap($.detailPopInfo.wrap);
                        $.detailPopInfo.isOpen=false;
                    }
                });
                _default.isButton && _button.bind('fastclick', function () {
                    //console.log($.detailPopInfo);
                    if($.detailPopInfo.isOpen) {
                        var result;
                        $.hideBottomLayout();
                        _default.buttonCallback && (result = _default.buttonCallback.call($(this), $.detailPopInfo.wrap, $.detailPopInfo.head,$.detailPopInfo.trigger, handler));
                        if (_default.isButton && !result && result !== undefined)
                            return false;
                        handler.hiddenWrap($.detailPopInfo.wrap);
                        $.detailPopInfo.isOpen = false;
                    }
                });

            });
            _default.initialCallback && _default.initialCallback.call($(this), wrap, relHead, $(this), handler);
        });

        function openWindowFn(e, rel, _wrap) {
            //_wrap[0].trigger=e;
            bodyScroll=$('body').scrollTop();
            //$.simpleAlert(bodyScroll.toString());
            _default.beforeOpenCallback && _default.beforeOpenCallback.call(e, _wrap, _detailHead, e);
            _article.css('display', 'none');
            var _detailHead = $('.headerDetail[data-rel=' + rel + ']');
            $.detailPopInfo.isOpen=true;
            $.detailPopInfo.trigger=e;
            $.detailPopInfo.wrap=_wrap;
            $.detailPopInfo.dataRel=rel;
            $.detailPopInfo.head=_detailHead;
            _wrap.css('display', 'block');
            _detailHead.css('display', 'block');
            _titleCont.css('display', 'none');
            _detailHead.find('.RIghtText').css('display', _default.isButton ? 'block' : 'none');
            _default.openCallback && _default.openCallback.call(e, _wrap, _detailHead, e);
        }

        return this;
    };
    //价格明细插件
    /*
     * 参数
     * @param content 指定明细页面
     * Type:{jQuery}
     *
     ** @param initialCallback 初始化后的回调函数 --> $(this)控件本身
     ** Type:{Function}
     *
     ** @param openCallback 触发打开时的回调函数 --> $(this)控件本身
     ** Type:{Function}
     *
     ** @param closeCallback 关闭后的回调函数 --> $(this)控件本身
     ** Type:{Function}
     *
     *
     * */
    $.fn.costDetailInitial = function (opts) {
        var _default = {
            content: $('#cost-detail'),
            'initialCallback': null,
            'openCallback': null,
            'closeCallback': null
        };
        _default = $.extend(_default, opts);
        var _this = this;
        var _wrap = _default.content;
        var _layout = _wrap.find('.js-hotel-opacity-layout');

        _default.initialCallback && _default.initialCallback.call(_this);

        this.each(function () {
            $(this).bind('fastclick', function () {
                $('.mainContent').addClass('blur');
                //_layout.removeClass('hotel-opacity2').addClass('hotel-opacity');
                _layout.css('display','block');
                _wrap.css('display', 'block');
                _default.openCallback && _default.openCallback.call(_this);
            });
        });

        document.addEventListener("webkitAnimationEnd", function () { //动画结束时事件
            if (/hotel-opacity2/.test(_layout.attr('class'))) {

                _wrap.css('display', 'none');
                _default.closeCallback && _default.closeCallback.call(_this);
            }
        }, false);

        _wrap.bind('fastclick', function () {
            $('.mainContent').removeClass('blur');
            //_layout.removeClass('hotel-opacity').addClass('hotel-opacity2');
            _layout.css('display','none');
        });

        return this;
    };
    //单选切换开关插件
    /*
     /*相同的data-groupby属性为一个组合，同组合下的实例为单项选择插件
     /*
     * 参数
     * @param initialCallback 初始化时的回调函数 --> $(this)控件本身
     * Type:{Function}
     ** @param state 开关状态 true表示开，false表示关
     ** Type:{Boolean}
     ** @param handler handler对象[1]*
     ** Type:{Boolean}
     *
     ** @param changeCallback 点击开关的回调函数 --> $(this)控件本身
     ** Type:{Function}
     ** @param state 开关状态 true表示开，false表示关
     ** Type:{Boolean}
     ** @param handler handler对象[1]*
     ** Type:{Boolean}
     *
     *  handler对象[1]*
     ** handler.group  返回当前组合的开关对象集合
     ** Type:{Function}
     ** return:{jQuery}
     *
     ** handler.change  设置某开关为开启或者关闭状态
     ** Type:{Function}
     ** return:void
     ** @param target 需要设置的开关元素
     ** Type:{jQuery}
     ** @param state 设置状态为 true:开启 false:关闭
     ** Type:{Boolean}
     *
     * */
    $.fn.switcher = function (opts) {
        var _default = {
            'initialCallback': null,
            'changeCallback': null
        };
        _default = $.extend(_default, opts);

        var handler = {};
        handler.group = function (name) {
            return $('body').find('div[data-groupby=' + name + ']');
        };
        handler.change = function (target, state) {
            var group, _groups, _siblings, cuiSwitch;
            target = target || $();
            target.each(function () {
                group = $(this).attr('data-groupby');
                _groups = handler.group(group);
                _siblings = _groups.not($(this));
                _siblings.find('.cui-switch').removeClass('current');
                _siblings.each(function () {
                    $(this)[0].state = false;
                    $(this)[0].changeCallback && $(this)[0].changeCallback.call($(this), $(this)[0].state, handler);
                });
                cuiSwitch = $(this).find('.cui-switch');
                if (state) {
                    $(this)[0].state = true;
                    cuiSwitch.addClass('current');
                } else {
                    $(this)[0].state = false;
                    cuiSwitch.removeClass('current');
                }
                $(this)[0].changeCallback && $(this)[0].changeCallback.call($(this), $(this)[0].state, handler);
            });
        };
        this[0].handler = handler;
        this.each(function () {
            $(this)[0].changeCallback = _default.changeCallback;
            $(this)[0].state = $(this).attr('data-default-state') === 'selected';
            $(this)[0].state ? $(this).find('.cui-switch').addClass('current') : $(this).find('.cui-switch').removeClass('current');
            $(this).bind('fastclick', function () {
                handler.change($(this), !$(this)[0].state);
            });
            _default.initialCallback && _default.initialCallback.call($(this), $(this)[0].state, handler);
        });

        return this;
    };
    //单选城市名插件
    /*
     *触发器与对话框的data-rel属性必须相同!!
     /*
     * 参数
     * @param trigger 触发元素
     * Type:{jQuery}
     *
     * @param defaultCity 默认城市名称
     * Type:{String}
     *
     * @param defaultValue 默认值
     * Type:{String}
     *
     * @param defaultValue 二级页面标题
     * Type:{String}
     *
     * @param onItemsTap --> $(this)控件本身
     * Type:{Function}
     ** @param elem 被点击选项元素
     ** Type:{jQuery}
     ** @param itemCity 被点击选项的城市名
     ** Type:{String}
     ** @param itemValue 被点击选项的值
     ** Type:{String}
     *
     ** handler.change  设置某开关为开启或者关闭状态
     ** Type:{Function}
     ** return:void
     ** @param target 需要设置的开关元素
     ** Type:{jQuery}
     ** @param state 设置状态为 true:开启 false:关闭
     ** Type:{Boolean}
     *
     * */
    $.fn.selectCityInitail = function (opts) {
        var _default = {
            trigger: $(),
            defaultCity: '我附近的位置',
            defaultValue: 'near',
            title: '选择城市',
            onItemsTap: null
        };
        _default = $.extend(_default, opts);
        _default.trigger.detailPop({
            title: _default.title
        });
        var rel = $(this).attr('data-rel');
        var _this = $(this);
        $.cookie(rel + '_city') || $.cookie(rel + '_city', _default.defaultCity, {expires: 10});
        $.cookie(rel + '_value') || $.cookie(rel + '_value', _default.defaultValue, {expires: 10});
        $.cookie(rel + '_hcl') || $.cookie(rel + '_hcl', '[]');
        var city = $.cookie(rel + '_city');
        var value = $.cookie(rel + '_value');
        var hisCont = $('#jsHistoryCityList');
        var hisListCont = hisCont.find('.list-city-tags');
        var hiddenVal = $('#hiddenCityVal');
        var cityList = $('#listCityTags li');
        var hisList;
        var hcl = JSON.parse($.cookie(rel + '_hcl'));
        if (!hcl.length) {
            hcl.unshift({city: city, value: value});
        }
        _default.trigger.find('em').text(city);
        hiddenVal.val(value);
        printHistory();
        cityList.each(function () {
            var itemCity = $(this).text();
            var itemValue = $(this).attr('data-value');
            city === itemCity && value === itemValue && $(this).addClass('current');
            $(this).bind('fastclick', function () {
                setIitem($(this));
                $(this).addClass('current').siblings('li').removeClass('current');
                _default.onItemsTap && _default.onItemsTap.call(_this, $(this), itemCity, itemValue);
            });
        });
        function setIitem(target) {
            $.detailPopHidden(rel);
            var itemCity = $(target).text();
            var itemValue = $(target).attr('data-value');
            var splice;
            $.cookie(rel + '_city', itemCity, {expires: 10});
            $.cookie(rel + '_value', itemValue, {expires: 10});
            _default.trigger.find('em').text(itemCity);
            hiddenVal.val(itemValue);
            var checkIndex = checkHCL(itemCity, itemValue);
            if (checkIndex === true) {
                hcl.length > 2 && hcl.pop();

            } else {
                hcl.splice(checkIndex, 1);
            }
            hcl.unshift({city: itemCity, value: itemValue});
            $.cookie(rel + '_hcl', JSON.stringify(hcl), {expires: 10});
            printHistory();
        }

        function checkHCL(city, value) {
            for (var i = 0; i < hcl.length; i++) {
                if (hcl[i].value === value && hcl[i].city === city)
                    return i;
            }
            return true;
        }

        function printHistory() {
            hisListCont.html('');
            for (var i = 0; i < hcl.length; i++) {
                hisList = document.createElement('li');
                hisList.setAttribute('data-value', hcl[i].value);
                hisList.setAttribute('data-mark', hcl[i].city);
                hisList.innerHTML = hcl[i].city;
                hisListCont.append(hisList);
            }

            hisListCont.find('li').bind('fastclick', function () {
                var city = $(this).text();
                var value = $(this).attr('data-value');
                setIitem($(this));
                cityList.each(function () {
                    var itemCity = $(this).text();
                    var itemValue = $(this).attr('data-value');
                    $(this).removeClass('current');
                    city === itemCity && value === itemValue && $(this).addClass('current');

                });
                _default.onItemsTap && _default.onItemsTap.call(_this, $(this), city, value);
            }).eq(0).addClass('current');
        }
    };
    //标题切换插件
    /*
     *切换元素与对话框的data-sort属性必须相同!!
     /*
     * 参数
     * @param switchChangCallback --> $(this)控件本身
     * Type:{Function}
     ** @param elem 控件本身
     ** Type:{jQuery}
     ** @param sortData 当前的视图名
     ** Type:{String}
     *
     * */
    $.fn.titleSwitch = function (opts) {
        var _default = {
            switchChangCallback: null
        };
        _default = $.extend(_default, opts);
        var _this = this;
        $(this).find('span').each(function (i, e) {
            $(e).bind('fastclick', function () {
                var sortData = $(this).attr('data-sort');
                $(this).addClass('current').siblings('span').removeClass('current');
                $('.page_switch_wrap[data-sort=' + sortData + ']').css({display: 'block'}).siblings('.page_switch_wrap').css({display: 'none'});
                _default.switchChangCallback && _default.switchChangCallback.call(_this, $(this), sortData);
            })
        });
    };
    //详情页缩略插件
    /*
     /*
     * 参数
     * @param switchChangCallback --> $(this)控件本身 显示/隐藏时的回调函数
     * Type:{Function}
     ** @param trigger 触发器
     ** Type:{string/jQuerySelector}
     **
     * @param openCallback --> $(this)控件本身 显示时的回调函数
     * Type:{Function}
     ** @param trigger 触发器
     ** Type:{string/jQuerySelector}
     *
     * @param closeCallback --> $(this)控件本身 隐藏时的回调函数
     * Type:{Function}
     ** @param trigger 触发器
     ** Type:{string/jQuerySelector}
     *
     * */
    $.fn.toggleSwitch = function (opts) {
        var _default = {
            trigger:'',
            closeHeight:70,
            switchChangCallback: null,
            'initialCallback': null,
            'openCallback': null,
            'closeCallback': null
        };

        _default = $.extend(_default, opts);
        $(this).each(function (i, e) {
            var _this = $(e);
            var trigger= $(e).find(_default.trigger.toString());
            var mod=$(e).find('.mod_bd').eq(0);
            if(_default.closeHeight>mod.children().eq(0).height()){
                trigger.css('display','none');
            }else{
                _this.addClass('detail_toggle_close').removeClass('detail_toggle_open');
                mod.css('max-height',_default.closeHeight);
                trigger.bind('fastclick', function () {
                    arguments.callee.isSpread == undefined && (arguments.callee.isSpread=false);
                    if(arguments.callee.isSpread){
                        $(this).addClass('detail_feature_up').removeClass('detail_feature_down');
                        _this.addClass('detail_toggle_open').removeClass('detail_toggle_close');
                        mod.css('max-height','none');
                        _default.openCallback && _default.openCallback.call(_this,$(this));
                    }else{
                        $(this).addClass('detail_feature_down').removeClass('detail_feature_up');
                        _this.addClass('detail_toggle_close').removeClass('detail_toggle_open');
                        mod.css('max-height',_default.closeHeight);
                        _default.closeCallback && _default.closeCallback.call(_this,$(this));
                    }
                    arguments.callee.isSpread=!arguments.callee.isSpread;
                    _default.switchChangCallback && _default.switchChangCallback.call(_this,$(this));
                    return false;
                })
            }
            _default.initialCallback && _default.initialCallback.call(_this,trigger);
        });
    };


    $.fn.anchorMap = function (opts) {
        var _default = {
            offsetTop:0,
            fixedMenu:'.detail_slide_tab',
            groupClass:'.js_tab_showbox',
            'tabChangCallback': null,
            'initialCallback': null
        };
        _default = $.extend(_default, opts);
        $(this).each(function (i, e) {
            var _this = $(e);
            var _thisMaxium;
            var fixedMenu=_this.find(_default.fixedMenu);
            var headHeight=$('#header').outerHeight();
            var showBox=_this.find(_default.groupClass);
            var handler={
                index:0,
                positionArr:new Array(showBox.length)
            };
            reDefindPostion();
            $(document).bind('fastclick',function(){
                reDefindPostion();
            });
            if(_this.outerHeight()>$(window).height()){
                var scrollTop, scrollTopFix;

                $(window).bind('scroll',function(){
                    scrollTop=$(this).scrollTop();
                    //scrollTopFix=scrollTop;
                    //console.log(_default.offsetTop+headHeight);
                    reDefindPostion();
                    if(_this.offset().top<scrollTop){
                        fixedMenu.addClass('fixed_top');
                        for(var i=1;i<handler.positionArr.length;i++){
                            if(handler.positionArr[i-1]<=scrollTop && handler.positionArr[i]>scrollTop){

                                /*setBorder(i-1);*/
                                handler.index=i-1;
                                _default.tabChangCallback && _default.tabChangCallback.call(_this,handler);
                                break;
                            }
                            else if(handler.positionArr[handler.positionArr.length-1]<=scrollTop){
                                /*setBorder(arr.length-1);*/
                                handler.index=handler.positionArr.length-1;
                                _default.tabChangCallback && _default.tabChangCallback.call(_this,handler);
                                break;
                            }


                        }

                        if(_thisMaxium<scrollTopFix){
                            fixedMenu.removeClass('fixed_top');
                        }
                    }else{
                        fixedMenu.removeClass('fixed_top');
                    }
                });
            }

            _default.initialCallback && _default.initialCallback.call(_this,handler);

            function reDefindPostion(){
                _thisMaxium=_this.offset().top+_this.outerHeight();
                showBox.each(function(i,e){
                    handler.positionArr[i]=Math.floor($(e).offset().top-headHeight-_default.offsetTop);
                });
            }

        });
    };

    $.fn.gallery = function (opts) {
        var _default = {
            cellName:0,
            animateTime:600,
            autoChange:true,
            'changCallback': null,
            'swiepCallback': null,
            'initialCallback': null
        };
        _default = $.extend(_default, opts);
        try{
            /*$(this).each(function (i, e) {
                var _this = $(e);
                _this.swipeshow({
                    autostart: _default.autoChange,
                    interval: _default.animateTime
                }).next();

            })*/
        }catch (e){
            throw new Error('gallery插件需要jquery.swipeshow.min.js插件支持!')
        }
    }

})(jQuery);