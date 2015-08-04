$(document).ready(function(){
 /* var PopStarSelect = $('.pop_star');
  PopStarSelect.find('dd').bind('fastclick',function(){
    $(this).addClass('CurrentSelect');
    $(this).siblings('dd').removeClass('CurrentSelect');
  });
  
  *//*hotel detail 标题文字垂直居中*//*
  var HotelName = $('.HotelName h2');
  HotelName.css({'margin-top':'-'+(HotelName.outerHeight()/2)+'px'});*/
  
  /*hotel detail 酒店房间里表头部固定*/
  /*var floatBox = $('.RoomHead');
  var winHeight = floatBox.offset().top-48;
  $(window).bind("scroll resize", function () {
    if ($(window).scrollTop() > winHeight) {
        floatBox.css({"position":"fixed","top":"48px","box-shadow":"0 2px 6px rgba(0,0,0,0.30)"});
    } else {
        floatBox.css({"position":"absolute","top":"0px","box-shadow":"none"});
    }
  });	*/
  
  /*hotel detail 更多房间*/

    //console.log(moreRoom.find('.MoreRoom')[0]);
    /*moreRoom.find('.MoreRoom')[0].addEventListener('touchstart',function(){
        if(j==1){
            moreRoom.find('li').css({display:'block'});
            $(this).find('span').addClass('ArrowUp').removeClass('ArrowDown');
            $(this).find('em').html('收起');
            j=0;
        }else{
            moreRoom.find('li:gt(3)').css({display:'none'});
            $(this).find('span').addClass('ArrowDown').removeClass('ArrowUp');
            $(this).find('em').html('显示全部')
            j=1;
        };
    });
    moreRoom.find('li').each(function(i,e){
        $(e)[0].addEventListener('touchstart',function(){
            $(this).css({'background':'#333'});
        });
    })*/
});