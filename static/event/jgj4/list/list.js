require.async(['common:ui/zepto','common:ui/iscroll', "common:ui/tips", "common:ui/tabs", "common:ui/template"],function($,iScroll, Tips, Tabs, Template){
    var fuc = {
        config: {
            page: 1,
            iEnd: 1,
            //bIsMetro: pageConfig.bIsMetro,
            tabType: pageConfig.iLoupanType,
            // region: aFilters.region ? aFilters.region : '',
            // line: aFilters.line ? aFilters.line : '',
            //districtUrl: '/' + pageConfig.sCityDomain + '/api/lp/region/' + 'filterid' + getString(aFilters, aFilterAbbr) + getString(aGetParams),
            //subwayUrl: '/' + pageConfig.sCityDomain + '/api/lp/subway/' + 'filterid' + getString(aFilters, aFilterAbbr) + getString(aGetParams)
            // subwayUrl: "/xf/data/ajax/xf/loupan/main/getList.json"
         },

        init: function() {
            var _this = this;
            _this.bindEvent();
            _this.getListInfo();
            // _this.touchEvent();
            // _this.searchTrigger();
        },
        bindEvent: function(){
            var _this = this;

            // tabs 轮换
            $(".tabnav").tabs({
                selecter: "a",
                targetAttr: "data",
                currentClass: "act",
                currentIndex : 0
            }).on('tabs:switch', function(event,index){
                _this.config.tabType = index+1;
                _this.config.page = 1;
                $(".details-building-data").html("");
                _this.getListInfo();
            });

            /*
            if(pageConfig.pageCount<=15) {
                _this.config.iEnd = 0;
            }
            */

            $("#loadMore").bind("click", function() {
                _this.config.page = _this.config.page +1;
                _this.getListInfo();
            });

        },
        getListInfo:function(){
            var _this = this; 
            //var url = '/' + pageConfig.sCityDomain + '/api/lp/more/'  + (_this.config.bIsMetro == 0 ? 'list/' : 'metro/') + (pageConfig.sUrlParams !='' ? pageConfig.sUrlParams + '-' : '') + 'pg' + _this.config.page + getString(aGetParams);
            var url = pageConfig.getListUrl;
            // var url = "/xf/data/ajax/xf/loupan/main/noList.json";
            //获取最新的sessionStorage数据
            $.ajax({
                type: "get",
                url: url,
                async: false,
                dataType: "json",
                data: {
                    "iLoupanType" : _this.config.tabType,
                    "iPage" : _this.config.page,
                    "iCityID" : pageConfig.iCityID
                },
                success:function(data){ 
                    try{
                        if(data.status == 1){
                            _this.config.iEnd = data.data.iPage >= data.data.iPageCount ? 0 : 1;
                            _this.config.page = data.data.iPage;                            
                            _this.appendHouseList(data.data);
                            if(_this.config.iEnd){
                                $(".innermy").addClass("hide");
                                $(".load_more_wrap").removeClass("hide");
                            }else{                                
                                $(".load_more_wrap").addClass("hide");
                            }
                            if(!_this.config.iEnd && _this.config.page != 1 ||  !_this.config.iEnd && _this.config.page == 1 && data.data.iPageCount ==1 ){
                                $(".innermy").addClass("hide");
                            }
                            if(!data.data.aLoupanList){
                                $(".innermy").removeClass("hide");
                                $(".load_more_wrap").addClass("hide");
                            }

                        }
                    
                    }catch(e){
                        Tips.error("获取列表信息异常"+e.message);
                    }
                },
                error: function(){
                    Tips.error("连接超时，请重试");
                },
                beforeSend: function(){
                    $("#new-pages").show();
                },
                complete: function(){
                    $("#new-pages").hide();
                }
            })  
        },
        appendHouseList:function(data){
            var _this = this;
            var listTpl = __inline('./list.tpl');
            if(data && data.aLoupanList){
                $(".details-building-data").append(Template.parse( listTpl, {    
                    list: data
                }));
            }else{
                $(".innermy").removeClass("hide");
                $(".load_more_wrap").addClass("hide");
            }
            
        }


    };

    fuc.init();
}); 