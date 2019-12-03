# 使用



在页面中引入：

````javascript
<script src="//api.map.baidu.com/api?v=15&ak=8rxt56R8pDlsz3yXawLdAMKh" type="text/javascript" head></script>
````



js中 require  baiduMap.js

````html
common/components/ui/baiduMap/baiduMap.js
````





具体使用：

````javascript
//初始化地图
            var baidu = new baiduMap({
                dom: "J_house_map",//必填，需要显示map的元素id
                housePoint: mapValue,//必填，坐标:type:Array [***,***]。
                pageType: "detail",//必填， detail 或者 around。指对应的是详情页，还是位置周边。
                loupanName: '单身公寓',//必填，detail页面中，会有一个label显示楼盘名。
                dragging: false, //非必填，是否可以拖动
                pinchToZoom: false, ////非必填，是否双指操作缩放
                scrollWheelZoom: false,//非必填，开启鼠标滚轮缩放
            });
````

这个js的初衷是 详情页和位置周边页面做封装。固有pageType这个字段：”detail“”around“，下面的非必填项，会根据pageType的页面的具体需求做统一设置。



暂时提供的方法只有一个：

````javascript
//获取位置周边地铁信息
            baidu.searchPlace('地铁').then(function (data) {
                page.createTrafficHtml(data);
            });
````

因为，现在详情页中·周边交通不是后台给出的数据，而是我们自己调用baidu的接口获取了。

以上代码是，查询初始化坐标周边1500米以内的地铁数据。 可以根据需求，修改成其他建筑物：”公交“，”图书馆“，”医院“等等····

返回的是一个数组：数据做过处理，只返回页面需要的数据。

````javascript
[
  {
    distance:280,line:"地铁8号线",station:"成山路"
  },
  {
    distance:1010,line:"地铁7号线、地铁8号线",station:"耀华路"
  }
]
````



## 问题

百度地图 api 由于加载的特殊性，不知道怎么做到完全模块化。

那位大神能改写一些，能够满足·回调