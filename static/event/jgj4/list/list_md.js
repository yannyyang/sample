/**
 * @fileOverview：新房H5列表页埋点js              
 * @version： 1.0.0                                                                              
 * @Date：2016-04-07                                                                              
 */

 require.async(['common:ui/zepto'],function($){

    $(document).ready(function(){
        // 前方高能：埋点统计
        var total = $('#J_total').attr('value'),  //搜索到符合条件的房源总数
            lpid = [];  
        $('#J_maidian .recommended_list').each(function(){
            lpid.push( $(this).attr('data-lpid') );  //当前页面展示的楼盘id集合
        });
        var data = {
           page_data: {
                hit_cnt: total, 
                imprsn_id: lpid 
            } 
        };
        globalLog.setArgusObj(data);   //页面关闭自动发送统计请求 

    });

}); 