/**
 * Created by Shengchenling711 on 2017/5/12.
 */
var $ = require('../../ui/zepto/zepto.js');
var Tips = require('../../ui/tips/tips.js');

var drawMasker;

var urlEncode = function (param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};

/**
 *地图
 *type:other 楼盘周边的infowindow,loupan 楼盘的infowindow
 */
function PingAnBMapInfoWindow(center, htmlContent) {
    this._center = center;
    this._htmlContent = htmlContent;
}
//继承 baidu overlay
PingAnBMapInfoWindow.prototype = new BMap.Overlay();
//重写 initialize 方法在这个方法中绘制 自己 dom 树。
PingAnBMapInfoWindow.prototype.initialize = function (map) {
    this._map = map;
    var div = document.createElement("div");
    div.style.cssText = "position:absolute; background:rgba(255,132,71,1);border:1px solid #ff4400; color:#fff;" +
        " border-radius:4px;box-shadow:2px 2px 2px" +
        " #b1b1af; padding:4px 8px; width:auto;font-size:12px; line-height:1.5; white-space:nowrap";
    div.innerHTML = this._htmlContent;
    map.getPanes().markerPane.appendChild(div);

    this._width = div.offsetWidth;
    this._height = div.offsetHeight;

    var tinyT = document.createElement("em");
    var tinyTLeft = this._width / 2 - 8;
    var tinyTTop = this._height - 3;

    div.appendChild(tinyT);
    tinyT.style.cssText = "position:absolute;z-index:5; display:block;width:0;height:0;top:" + tinyTTop + "px;left:" + tinyTLeft + "px;border-top:8px solid rgba(255,132,71,1);border-right:8px solid transparent;border-left:8px solid transparent;";

    var borderT = document.createElement("em");
    var borderTLeft = this._width / 2 - 8;
    var borderTTop = this._height - 2;

    div.appendChild(borderT);
    borderT.style.cssText = "position:absolute; z-index:4;display:block;width:0;height:0;top:" + borderTTop + "px;left:" + borderTLeft + "px;border-top:8px solid #ff4400;border-right:8px solid transparent;border-left:8px solid transparent;";

    this._div = div;
    return this._div;
};
// 实现绘制方法
PingAnBMapInfoWindow.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器
    var position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - ((this._width / 2) - 2) + "px";
    this._div.style.top = position.y - ((this._height + 22) + 9) + "px";
};
PingAnBMapInfoWindow.prototype.show = function () {
    if (this._div) {
        this._div.style.display = "";
    }
};

drawMasker = PingAnBMapInfoWindow;

function baiduMap(opt) {
    this.options = $.extend({
        dom: '',
        pageType: 'around',
        autoCreateMap: false,
        housePoint: '',
        loupanName: '',
        dragging: true,
        pinchToZoom: true,
        scrollWheelZoom: true,
        createLabel: true
    }, opt || {});

    this.init()
}

baiduMap.prototype = {
    config: {
        mapApi: "//api.map.baidu.com/api?v=2.0&ak=8rxt56R8pDlsz3yXawLdAMKh",
        placeApi: window.config.aURL.sHome+ "/ajax/baidu/place/v2/search",
        sStaticRoot: window.config.aURL.sStaticRoot,
        icons: {
            loupan: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_loupan_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            bank: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_bank_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            bus: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_bus_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            commiunty: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_community_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            food: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_food_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            hospital: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_hospital_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            metro: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_metro_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            school: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_school_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
            shop: (function () {
                var o = {
                    url: window.config.aURL.sStaticRoot + __uri("./img/pin/pin_shop_ic.png"),
                    size: new BMap.Size(32, 32),
                    anchor: new BMap.Size(9, 26)
                };
                return new BMap.Icon(o.url, o.size, {anchor: o.anchor});
            })(),
        },
        gSearchMap: {
            "公交": 'bus',
            "地铁": 'metro',
            "学校": 'school',
            "医院": 'hospital',
            "银行": 'bank',
            "购物": 'shop',
            "美食": 'food',
            "小区": 'commiunty',
        },
        allTempMarker: []
    },

    init: function () {
        var _self = this;
        _self._initBDMapCallBack();
        _self._createMasker();
    }
    ,

    _initBDMapCallBack: function () {
        var _self = this;
        if (_self.options.dom && _self.options.housePoint) {

            if (_self.options.pageType == "panorama") {
                var panorama = new BMap.Panorama(_self.options.dom);
                panorama.setPosition(new BMap.Point(_self.options.housePoint[0], _self.options.housePoint[1]));
                panorama.setPov({heading: -13, pitch: 6});
            } else {
                // 百度地图API功能
                _self.map = new BMap.Map(_self.options.dom);    // 创建Map实例
                _self.mapPt = new BMap.Point(_self.options.housePoint[0], _self.options.housePoint[1]);
                _self.map.centerAndZoom(_self.mapPt, 16);  // 初始化地图,设置中心点坐标和地图级别

                if (!_self.options.dragging) {
                    _self.map.disableDragging();//禁用地图拖拽
                }

                if (!_self.options.pinchToZoom) {
                    _self.map.disablePinchToZoom();//禁用双指操作缩放
                }

                if (!_self.options.scrollWheelZoom) {
                    _self.map.enableScrollWheelZoom();     //开启鼠标滚轮缩放
                }
            }
        } else {
            Tips.show('没有传dom或坐标，请检查');
        }
    }
    ,

//生成楼盘masker
    _createMasker: function () {
        var _self = this;
        if (!_self.options || !_self.options.pageType) {
            Tips.show("请填写pageType，detail或around")
        } else {
            if (_self.options.pageType == "detail") {
                _self.masker = new drawMasker(_self.mapPt, _self.options.loupanName);
                _self.map.addOverlay(_self.masker);
            } else if (_self.options.pageType == "around") {
                _self.masker = new BMap.Marker(_self.mapPt, {icon: _self.config.icons.loupan});
                _self.map.addOverlay(_self.masker);
            }
        }
    }
    ,

//查询建筑物
    _searchPlace: function (options) {
        var _self = this;
        if (!options || !options.query) {
            Tips.show("还没有输入需要查询的建筑物")
        } else {
            var url = _self.config.placeApi + urlEncode(options);
            var result;
            return $.ajax({
                url: url,
                type: 'get',
                dataType: 'jsonp',
                async: false,
                success: function (data) {
                    if (!data.status == 0) {
                        Tips.show(data.message);
                        result = false;
                    } else {
                        result = data.results;
                    }
                },
                error: function () {
                    Tips.show("请求报错了")
                }
            }).then(function (data) {
                return data.results;
            });
        }
    }
    ,

//local查询
    _searchLocalPlace: function (options) {
        var _self = this;


        var local = new BMap.LocalSearch(_self.map, {
            renderOptions: {
                autoViewport: true,
                selectFirstResult: true
            },
            onSearchComplete: function (results) {
                var currentTempMarker = [];
                if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                    // 判断状态是否正确
                    var s = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                        var posInfo = results.getPoi(i);

                        var lat2 = posInfo.point.lat;
                        var lon2 = posInfo.point.lng;
                        var address = posInfo.address;
                        var title = posInfo.title;
                        var tempMarker = new BMap.Marker(posInfo.point, {icon: _self.config.icons[_self.config.gSearchMap[options.key]]});  // 创建标注
                        tempMarker.setTitle(title);

                        _self.map.addOverlay(tempMarker); // 将标注添加到地图中
                        currentTempMarker.push(tempMarker);
                        tempMarker.addEventListener("click", function (e) {
                            _self._openInfo(this.getTitle(), e);
                        });
                    }
                    _self.config.allTempMarker.push({id: options.key, tempMarker: currentTempMarker});
                } else {
                    alert('附近没有相关设施');
                }
            }
        });
        local.searchNearby(options.key, _self.mapPt, 2000);
    }
    ,

    _openInfo: function (content, e) {
        var p = e.target;
        var _self = this;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
        _self.map.openInfoWindow(infoWindow, point); //开启信息窗口
    },

//查询两个坐标间的距离
    _getDistance: function (pt1, pt2) {
        var _self = this;
        if (!pt1 || !pt2) {
            Tips.show("请输入两个坐标")
        } else {
            return parseInt(_self.map.getDistance(pt1, pt2))
        }
    }
    ,

//处理数据
    _dealData: function (data) {
        var _self = this;
        var results = [];
        var startPt, endPt;
        startPt = _self.mapPt;
        for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.station = data[i].name;
            obj.line = data[i].address.split('地铁').join('').replace(/;/g,'、');
            endPt = new BMap.Point(data[i]['location']['lng'], data[i]['location']['lat']);
            obj.distance = _self._getDistance(startPt, endPt);
            results.push(obj);
        }
        return results;
    }
    ,

    get_place_distance: function (key) {
        var _self = this;
        var params = {};
        var results;
        params.query = key || '地铁';
        params.output = 'json';
        params.radius = '1500';
        params.location = _self.mapPt.lat + ',' + _self.mapPt.lng;

        //获取周边的建筑物
        return _self._searchPlace(params).then(function (data) {
            return _self._dealData(data)
        });


    }
    ,

    set_place_point: function (key) {
        var _self = this;
        if (key == "") {
            Tips.error("请输入关键字");
            return false
        }
        var opt = {
            key: key,
        }
        _self._searchLocalPlace(opt);

    }
    ,

    delete_place_point: function (key) {
        var _self = this;
        if (key == "") {
            Tips.error("请输入关键字");
            return false
        }
        var opt = {
            key: key,
        }

        var curAllTempMarker = _self.config.allTempMarker;

        for (var i = 0; i < _self.config.allTempMarker.length; i++) {
            if (curAllTempMarker[i].id == key) {
                for (var j = 0; j < curAllTempMarker[i].tempMarker.length; j++) {
                    _self.map.removeOverlay(curAllTempMarker[i].tempMarker[j])
                }
                ;
                curAllTempMarker.splice(i, 1);
            }
        }
    }
}
return baiduMap;


