/**
 * Created by Smile on 2017/11/14.
 */
$(function () {
    //获取地址栏商品的id
    var id = tools.getParam("productId");
    console.log(id);

    //发送 Ajax 请求，获取 商品详情数据
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'GET',
        data: {
            id: id
        },
        success: function (backData) {
            console.log(backData);

            // 给商品详情 添加等待 刷新效果图
            $('.product').html('<div class="loading"><span class="mui-icon mui-icon-spinner"></span></div>');

            // 定义计时器， 让刷新效果图先执行，再渲染
            setTimeout(function () {
                //使用模板引擎  渲染数据
                $('.mui-scroll').html(template('proDetailTmp', backData));
                //动态生成 轮播图  需手动设置初始化  轮播图片
                mui('.mui-slider').slider({
                    interval: 1000
                })
                // $('.product').html('');
            }, 500);




            //动态添加  数字框  需要手动初始化
            mui('.mui-numbox').numbox();

            // 点击商品尺码时，添加类  移除其他类
            $('.mui-scroll').on('tap', '.chooseSize', function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    })


    //点击 加入购物车 注册单击事件
    $('.btn_cart').on('click', function () {

        //获取当前选择 商品id (上面获取过)  数量 、尺码
        var num = $('.num input').val();
        var size = $('.size .chooseSize.active').html();
        // console.log(size);
        //判断 如果没有选择 尺码时，提示用户选择尺码
        if (!size) {
            mui.toast("请选择商品尺码");
            return false;
        }

        // 发送 Ajax请求 ，获取用户添加到购物车数据
        $.ajax({
            url: '/cart/addCart',
            type: 'POST',
            data: {
                productId: id,
                num: num,
                size: size
            },
            success: function (backData) {
                console.log(backData);
                //判断有没有登录，如果没有登录 ，跳转登录页 把当前地址一起拼上去 方便登录成后跳转原页面
                //调用 封装方法
                tools.getCheckLogin(backData);

                //如果登录了，跳转 购物车页面
                if (backData.success) {
                    mui.confirm("添加商品成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
                        if (e.index === 0) {
                            location.href = "shoppingCart.html";
                        }
                    })
                }
            }
        })
    });

});