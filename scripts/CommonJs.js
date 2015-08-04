/*jquery插件*/

$(document).ready(function(){

    /*所有loading隐藏*/
    $('.loading_ico').css({'display':'none'});
    $('#header .ReturnIco').bind('fastclick',function(){
        history.go(-1);
    });


});