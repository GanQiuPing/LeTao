/**
 * Created by Smile on 2017/11/11.
 */

//初始化区域滚动
mui('.mui-scroll-wrapper').scroll({
    indicators: false,  //是否显示滚动条
    deceleration: 0.0005  //阻尼系数，系数越小，滑动越灵敏
});


// 初始化 mui 图片轮播插件
// 获得 slider 插件对象
var gallery = mui('.mui-slider');
gallery.slider({
    //自动轮播周期，若为0则不自动播放，默认为0
    interval: 500
})

// 封装tools工具类 ，里面提供了 getParamObj可以获取所有参数，返回一个对象
// getParam 方法 ，传进来一个key 返回对应值

var tools = {
    getParamObj: function () {
        //bom中 有一个内置对象，用来获取地址栏参数值
        var search = location.search;
        //1. 获取参数，如果有中文，需对地址栏参数进行 解码 decodeURL
        search = decodeURI(search);
        //2. 把参数 ？截取方法有 slice  substr substring 三种方法，其中 slice功能比较好用
        // slice(start,end),不包含end.   不一样的是： slice 可以截取负数，substring不可以
        search = search.slice(1);
        //3. 需要把 search参数转换为obj对象， 方便获取任意参数
        var arr = search.split("&");
        var obj = {};  //定义一个空对象

        //把arr 数组进行遍历，把数组中 =号前面的当成obj的属性名，=号后面的当成obj属性值
        for (var i = 0; i < arr.length; i++) {
            var k = arr[i].split("=")[0];
            var v = arr[i].split("=")[1];

            //存入 对象中
            obj[k] = v;
        }
        return obj;
    },
    getParam: function (key) {
        return this.getParamObj()[key];
    },
    getCheckLogin: function (backData) {
        if (backData.error === 400) {
            location.href = "login.html?backUrl=" + location.href;
        }
    }
}


//作业：var obj = {name:"zs", age:18, desc:"呵呵"}  转换成字符串  name=zs&age=18&desc=呵呵













