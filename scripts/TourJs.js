﻿// JavaScript Document
(function ($) {
    $.extend({
        initialTourList: function (url) {
            var list = $('.page article .TourList');
            var myScroll={};
            var pullUpEl = $('#pullUp'), pullUpOffset = pullUpEl.height();
            var label = pullUpEl.find('.pullUpLabel');
            var page = 1;
            var isBind = 0;//记录初始事件绑定
            var body=$('body');
            var isLoading=false;
            var blankPic='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAA1JREFUGFdj+P//PwMACPwC/ohfBuAAAAAASUVORK5CYII=';
			var headerHeight=$('#header').height();
			var bottomHeight=$('#BottomNav').height();
            //数据初始化弹出提示清空页面
            list.html('');
            $('#loading').css({'display': 'block', 'opacity': 1});
            getAajxData(url);
            /**
             * 获取数据
             * myScroll.refresh();        // 数据加载完成后，调用界面更新方法
             */
            function getAajxData(url) {
                $.ajax({
                    type: 'GET',
                    async: 1,
                    url: '../ajax/' + url + page + '.txt?t=' + new Date().getTime(),
                    beforeSend: function (e) {
                        isLoading=true;
                    },
                    timeout:10000,
                    success: function (e) {
                        //初始加载数据成功后隐藏提示
                        if (!isBind) {
                            $('#loading').animate({'opacity': "0"}, 800, function () {
                                $(this).css({'display': 'none'});
                            });
                        }
                        //JSON数据格式参考 ../ajax/destination1.txt
                        var dataJSON = JSON.parse(e);
                        if (dataJSON.ResponseStatus.Ack == "Success") {
                            //添加数据
                            list.append(addList(dataJSON.Data, dataJSON.ResponseStatus).join(''));
                            //lazyload
                            $('#TourList').find('.TourImageCont img').lazyload();
                            //更新页数信息
                            myScroll.responsePage = dataJSON.ResponseStatus.Page;
                            myScroll.responseCount = dataJSON.ResponseStatus.PageCount;
                            isLoading=false;
                            //更新iScroll
                            setTimeout(function () {
                                //myScroll.refresh();
                                $('#TourList li').bind('fastclick', function () {
                                    var href = $(this).attr('data-info');
                                    document.location.href = 'tour_detail.html?' + href;
                                })
                            }, 200);
                        }
                        //初始化后绑定iScroll控件
                        if (!isBind) {
                            //取消默认事件
                            /*$('body')[0].addEventListener('touchmove', function (e) {
                                e.preventDefault();
                            }, false);*/
                            //标记已添加事件
                            isBind = 1;
                            //绑定滑动底部上拉事件
                            bindDrawUp(url);

                        }

                    },
                    error: function (e) {
                        //数据初始化失败
                        if (!isBind) {
                            $('#loading span').text('数据加载错误，请刷新页面');
                        }else{
                            label.text('数据加载错误，请刷新页面');
                            pullUpEl.removeClass('loading').removeClass('flip').addClass('noResult');
                            pullUpEl.find('.pullUpIcon').css('display', 'none');
                        }
                    }
                });
            }

            function bindDrawUp(url) {
                var _this=this;

                list[0].addEventListener('touchmove',function(e){
                    var et=e||event;
                    var scrollTop=body.scrollTop();
                    if(scrollTop>=list.outerHeight()+headerHeight+bottomHeight+pullUpEl.outerHeight()-$(window).height()&& myScroll.responsePage < myScroll.responseCount && !isLoading){
                        if(!/loading/.test(pullUpEl.attr('class'))&&!/noResult/.test(pullUpEl.attr('class'))){
                            label.text('页面加载中...');
                        }
                        pullUpEl.addClass('loading');
                        page++;//添加一页
                        getAajxData(url);
                    }
                },false);
                        /*if (this.responsePage !== this.responseCount) {
                            pullUpEl.addClass('loading');
                            label.text('加载中...');
                            page++;//添加一页
                            getAajxData(url);
                        }*/
            }

            function addList(data, response) {
                var strArr = [];
                if (data.ProductInfoList.length) {
                    var str = '';
                    var pd;
                    for (var i = 0; i < data.ProductInfoList.length; i++) {
                        pd = data.ProductInfoList[i].ProductInfo;
                        //数据模板
                        str = '<li data-info="' + pd.link + '">\
                        <div class="TourImage">\
                        <div class="TourImageCont"><img data-original="' + pd.Img + '" src="' + blankPic + '" /></div>\
                        <span class="type type01">' + pd.ProductPatternName + '</span>\
                        <span class="start">' + pd.DepartCityName + '</span>\
                        </div>\
                        <div class="TourContent">\
                        <h3>' + pd.Name + '</h3>\
                        <div class="discount">';
                        for (var j = 0; j < pd.PromotionTag.length; j++) {
                            if (pd.PromotionTag[j].type == "discount") {
                                str += '<i class="hui">' + pd.PromotionTag[j].TagName + '</i>';
                            } else {
                                str += '<i class="tag">' + pd.PromotionTag[j].TagName + '</i>';
                            }
                        }

                        str += '</div>\
                        <p class="date">' + pd.ScheduleDesc + '</p>\
                        <div class="price"><dfn>&yen;</dfn><strong>' + pd.MinPrice + '</strong>起</div>\
                        </div>\
                        </li>';


                        strArr.push(str);
                    }
                }
                if (response.Page !== response.PageCount) {
                    label.text('上拉加载更多...');
                    pullUpEl.find('.pullUpIcon').css('display', 'block');
                    pullUpEl.find('.cont').removeClass('noResult');
                    if (pullUpEl[0].className.match('loading')) {
                        pullUpEl.removeClass('flip').removeClass('loading');
                    }
                } else {
                    pullUpEl.find('.pullUpIcon').css('display', 'none');
                    pullUpEl.find('.cont').addClass('noResult');
                    label.text('没有更多结果了');
                }
                return strArr;
            }
        }
    });
})(jQuery);
$(document).ready(function () {
    //console.log($('.BoxContent').height(),$('.BoxContent')[0]);
    var TabFilter = $('.TourFooter');
    TabFilter.find('.BottomNav li').each(function (i, e) {

    });

});
