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
