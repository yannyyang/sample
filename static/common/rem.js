;(function(window) {          
    //通过window width 修改html font-size
    function fixRem(){
        var windowWidth =  document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
        windowWidth = windowWidth > 800 ? 800 : windowWidth;
        var rootSize = 28 * ( windowWidth / 375);
        var htmlNode = document.getElementsByTagName("html")[0];
        htmlNode.style.fontSize = rootSize+'px';
    }
    fixRem();
    window.addEventListener('resize', fixRem, false);

})(window);