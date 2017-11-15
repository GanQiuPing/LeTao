/**
 * Created by Smile on 2017/11/14.
 */
$(function () {

    //添加下拉刷新   发送Ajax请求， 渲染购物车页面数据
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            down: {
                auto: true,// 首次加载自动上拉刷新一次
                //刷新函数，根据业务来编写，
                callback: function () {
                    //发送Ajax请求， 渲染购物车页面数据
                    $.ajax({
                        url: '/cart/queryCart',
                        type: 'GET',
                        success: function (backData) {
                            console.log(backData);
                            //判断是否登录
                            tools.getCheckLogin(backData);
                            //结合模板引擎 渲染数据
                            $('.mui-table-view').html(template('cartTmp', {backData: backData}));

                            //结束下拉刷新
                            setTimeout(function () {
                                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                            }, 1000)
                        }
                    })
                }
            }
        }
    })

    // 点击 删除按钮 实现删除购物车对应功能
    /* 注意： 事件要用 tap事件，click事件是无法获取到的
     *   思路: 1. 给删除按钮注册 事件
     *     2. 获取要删除对应的商品id
     *     3. 提示消息
     *     4. 发送Ajax请求，获取删除数据
     *     5.  需要手动刷新一次
     * */

    $('.content').on('tap', '.cartDel', function () {
        //获取当前选择的商品对应id
        var id = $(this).data('id');
        console.log(id)


        //提示用户是否确定删除
        mui.confirm("您是否要删除此数据吗?", "温馨提示", ["是", "否"], function (e) {
            if (e.index === 0) {
                //发送Ajax请求，获取 删除数据
                $.ajax({
                    url: '/cart/deleteCart',
                    type: 'GET',
                    data: {
                        id: id
                    },
                    success: function (backData) {
                        console.log(backData);
                        if (backData.success) {
                            // 请求数据回来后，需要手动下拉刷新一次
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                })
            }
        });
    })


    //编辑功能
    /*
     *1. 给 编辑按钮注册 委托事件
     * 2. 设置自定义属性  ，获取当前选择购物车的id 尺码 数量 ，
     *      用 dataset方法（因为没有提供此接口，所以通过自定义属性）
     * 3. 发送 Ajax请求，获取商品详情数据，用弹出框结合模板渲染
     * 4.  需要修改的 尺码  数量 （设置自定义属性获取 ）
     * 5. 弹出修改信息框
     * 6. 点击确定修改时，发送Aajx 请求，保存数据
     * 7. 重新渲染
     * */

    // 给编辑按钮  注册单击事件
    $('.content').on('tap', '.cartEdit', function () {

        //获取 自定义属性 ，通过 dataset方法 可以直接获取
        console.log(this.dataset);

        // 使用模板引擎  把得到的 Dom元素 放置提示框中显示
        var html = template('cartEditTmp', this.dataset);

        //去掉所有 换行符 ，因为 mui默认把 换行元素 当成 br解析
        html = html.replace(/\n/g, '');

        //编辑提示框
        mui.confirm(html, "编辑商品", ["修改", "取消"], function (e) {
            if (e.index === 0) {
                //获取当前数据选中状态  对应id  尺码 数量
                var id = $('.cartEdit').data('id');
                var num = $('.mui-numbox-input').val();
                var size = $('.size span.active').html()

                //发送Ajax 请求，修改数据
                $.ajax({
                    url: '/cart/updateCart',
                    type: 'POST',
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    success: function (backData) {
                        console.log(backData);
                        //判断返回成功后, 手次下拉刷新一次
                        if (backData.success) {
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                })

            }
        });

        //给 size 下的 span 注册 单击事件  ,动态生成后 重新初始化
        $('.size span').on('tap', function () {
            $(this).addClass('active').siblings().removeClass('active');
        })

        //重新初始化 数字框
        mui('.mui-numbox').numbox();
    });


    /**计算总金额
     * 1. 获取选中 checkbox状态的 商品
     *  2. 获取自定义属性 价格 数量
     * @type {number}
     */

    // 给所有 checkbox 注册单击事件
    // 这里不能用 tap事件，触摸触发的，click在老的浏览器中 会有300ms的延迟
    $('.content').on('change', '.checkPro', function () {
        // 获取 当前选中checkbox 的状态
        console.log($('.carLeft .checkPro:checked'));
        //定义 总金额变量
        var totalCount = 0;
        //给每个选 中 的 checkbox 循环
        $('.carLeft .checkPro:checked').each(function (e, i) {
            //获取到 自定义属性 价格 *  数量
            totalCount += this.dataset.num * this.dataset.price;
        })
        //赋值给 页面上 显示总金额 的 span  保留两位小数
        $('.totalMoney span').html(totalCount.toFixed(2));
    })

});