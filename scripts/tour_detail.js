/**
 * Created by Administrator on 2015/3/15.
 */
$(function(){
    $(window).resize(function(){
        justifyImg();
    });
    var justifyImg=function (){
        var width=$(window).width();
        var height=width*0.56;
        $('#image-node img').css({'width':width,'height':height});
        $('#image-node').css({'width':width,'height':height});
    };
    justifyImg();
    $('#ctm_tour_detail_book').tapToHref();
    $('#ctm_tour_detail_schedule').tapToHref();
});