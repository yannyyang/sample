require.async(['common:ui/zepto'],function($){
    var $navHeight = $(window).height();
    var navBox = $(".hf-nav-box");

    $(".hf-nav-box").css({
        height: $navHeight,
        overflow: 'auto'
    });

    // nav点击显示隐藏
    $("#nav-btn").unbind().bind("click",function(e){
    	$(".nav_box").removeClass("hide");
        navBox.css({display:'block'}).animate({right:0},200);

    });

    $(".nav_box").bind("click",function(){
    	$(".nav_box").addClass("hide");
        navBox.css({display:'none'}).animate({right:-165},200);
    });

    if($("#nav-mask").length){
        document.getElementById('nav-mask').ontouchmove = function(){return false;};
        document.getElementById('hf-nav-box').ontouchmove = function(){return false;};
    }

    $(document).on('click', '.hf-nav-ul a', function(event) {
        var href = $(this).prop('href');
        navBox.css({
            display:'none',
            right:-165
        });
        // $('#nav-mask').remove();
        $("#nav-mask").addClass("hide");
        window.location.href = href;
    }).on('scroll', function() {
        $('#hf-nav-box').css('height', $(window).height());
    });

});