/**
 * 移动端触发分页的动作, 进行PV的统计。
 *
 * @authors jixuelian
 * @date    2017-12-21
 */
var $ = require('common:zepto');
/**
 * @options 发送ajax的数据
 * @pageNo  分页的页数。 可不填，默认统一使用options.data.pageNo， 当参数名非pageNo时，需要此参数
 */
var listAjax = function (options, pageNo) {
    // 埋点
    var page = pageNo || options.data.pageNo || '';
    var pagingTJ = function () {
        var aa = globalLog.getArgusObj();
        var bb = $.extend(aa, {
            'self_event_type': 'PUBLIC_LOAD_PAGE',
            'el_data': {
                'pageNo': page
            }
        });
        globalLog.send(bb);
    }
    // 合并已有beforeSend
    if (page != 1) {
        var beforeSend = options.beforeSend ? options.beforeSend : (function (){});
        options.beforeSend = function () {
            pagingTJ();
            beforeSend();
        }
    }
    //发送请求
    $.ajax(options);
}
module.exports = listAjax;
