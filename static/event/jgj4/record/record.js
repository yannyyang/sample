require.async(["common:ui/zepto", "common:ui/tips", "common:ui/tabs", "common:ui/template"], function($, Tips, Tabs, Template) {
    var fuc={
        cashTpl : __inline('record.tpl'),
        cashListWrap : $('#J_cash_tpl'),
        curPage : 1,

        init:function(){
            this.bindEvent();
            this.touchEvent();
            var pageHref = window.location.href;
            if(pageHref.indexOf('?') > -1){
                var sTab = pageHref.split("?tab=")[1];
                if(sTab == 'cash'){
                    $('.cash_btn').trigger('tap');
                }
            }
        },
        bindEvent:function(){
            var _this = this;
            // tabs 轮换
            $(".nav-list").tabs({
                selecter: "a",
                targetAttr: "data",
                event: "tap",
                currentClass: "nav-active",
                currentIndex : 0
            })
            .on('tabs:switch', function(event, index){
                if(index == 1){
                    _this.fetchList();
                }else{
                    $('#tabCash').find('.cash_state').hide();
                }
            });

            $(document).on('tap','.btn_active',function(){
                var dataType = $(this).attr('data-type');
                _this.lqGfjEvent(dataType,$(this));
            })
        },
        lqGfjEvent: function($type,$this) {
            $.ajax({
                type: "get",
                url: pageConfig.sCouponApiUrl,
                dataType: "json",
                data: {iType:$type},
                success: function(data) {
                    if( data.status ==1 ) {
                        $this.removeClass("btn_active").addClass("btn_gray");
                        $this.html('已领取');
                        Tips.show('领取成功');
                    }else{
                        Tips.error(data.errmsg);
                    }
                }

            });
        },
        fetchList:function(){
            var self = this;
            $('.new-pages').show();
            $.ajax({
                url : pageConfig.sCashHistoryApiUrl,
                dataType : 'json',
                type : 'post',
                data:{iPage:self.curPage++,iPageSize:15},
                success:function(data){
                    $('.new-pages').hide();
                    if(data.status == 1 ){
                        $('#tabCash').find('.cash_state').show();
                        $('.total').html(data.data.iTotal);
                        if(data.data.aList.length > 0){
                            var cashList = data.data.aList;
                            var htmlArray = [];
                            for(var i = 0;i < cashList.length;i++){
                                var cashItem = cashList[i];
                                htmlArray.push(Template.parse(self.cashTpl,{cash:cashItem}));
                            };
                            self.cashListWrap.append(htmlArray.join(''));
                        }

                    }else{
                        $('#tabCash').find('.record-list').hide();
                        $('#tabCash').find('.none-list').show();
                    }
                }
            })
        },
        touchEvent: function(){
            var _this = this;
            var startPosition, endPosition, deltaX, deltaY, moveLength;
            $(document).bind("touchstart", function(e) {
                var touch = e.targetTouches[0];
                startPosition = {
                    x: touch.pageX,
                    y: touch.pageY 
                }
            })
            if(navigator.userAgent.indexOf("Android") > -1) {
                $(document).bind("touchcancel", function(e) {
                    var touch = e.changedTouches[0];
                    endPosition = {
                        x: touch.pageX,
                        y: touch.pageY
                    }
                    deltaX = endPosition.x - startPosition.x;
                    deltaY = endPosition.y - startPosition.y;
                    var scrollTop = $(window).scrollTop();
                　　var scrollHeight = $(document).height();
                　　var windowHeight = $(window).height();    
                    if(scrollTop + windowHeight >= scrollHeight && deltaY < 0){
                        callback.call();
                　　}   
                })   
            }
            $(document).bind("touchend", function(e) {
                var touch = e.changedTouches[0];
                endPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
                deltaX = endPosition.x - startPosition.x;
                deltaY = endPosition.y - startPosition.y;
                var scrollTop = $(window).scrollTop();
            　　var scrollHeight = $(document).height();
            　　var windowHeight = $(window).height();    
                if(scrollTop + windowHeight >= scrollHeight && deltaY < 0){
                   _this.fetchList();
            　　} 
            })   
        }
    }

    fuc.init();
})