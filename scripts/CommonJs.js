/*jquery插件*/

$(document).ready(function(){
    $('body').height($(window).height());
    /*所有loading隐藏*/
    $('.loading_ico').css({'display':'none'});
    $('#header .ReturnIco').bind('fastclick',function(){
        history.go(-1);
    });


});