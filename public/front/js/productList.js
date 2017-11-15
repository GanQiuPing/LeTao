/**
 * Created by Smile on 2017/11/13.
 */
$(function () {

    //定义分页参数值
    var currentPage = 1;
    var pageSize = 5;

    //获取地址栏传过来参数的值
    var key = tools.getParam("key");
    //把传过来的参数值 赋值给 input
    $(".search input").val(key);


    //封装函数  ，发送Ajax 请求，获取当前搜索的商品列表 渲染页面
    function render() {

        //判断是否需要发送排序参数，获取选中那个a标签的type属性
        var type = $('.category_Sort a[data-type].active').data('type');
        //找到 a 下面的 span 判断箭头，如是要 向下=2 降序， 向上=1 升序
        var value = $('.category_Sort a[data-type].active').find("i").hasClass('fa-angle-down') ? 2 : 1;
        console.log(value);

        //定义对象
        var obj = {};
        obj.proName = key;
        obj.page = currentPage;
        obj.pageSize = pageSize;

        //判断如是渲染时， 发现排序字段有 active 属性，说明需要排序   存入属性名：属性值
        console.log("type:" + type);
        if (type) {
            obj[type] = value;
        }

        $.ajax({
            url: '/product/queryProduct',
            type: 'GET',
            data: obj,
            success: function (backData) {
                console.log(backData);
                //定义计时器 让客户体验不会有点延迟效果
                setTimeout(function () {
                    // 使用模板引擎  渲染数据
                    $('.product').html(template('proListTmp', backData));
                    //调用 下拉刷新结束
                    // mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                }, 1000);
            }
        })
    }

    // 页面加载时 渲染数据
    render();

    //点击搜索按钮时，需要获取到 key ，重新渲染
    $('.search .btn_search').on('click', function () {
        //获取 key
        key = $('.search input').val().trim();
        // 如果 key 等于 空时，
        if (key === '') {
            mui.toast("请输入搜索内容");
            return false;
        }
        //点击搜索按钮 时候 ，需要清空所有排序条件
        $('.category_Sort a').removeClass('active').find("i").removeClass("fa-angle-up").addClass("fa-angle-down");

        // 给商品区 添加等待 刷新效果图
        $('.product').html('<div class="loading"><span class="mui-icon mui-icon-spinner"></span></div>');

        //重新渲染数据
        render();
    })

    /*
     * 排序功能
     *  1. 给 a 标签中 有 data-type 属性注册单击事件
     *  2. 如果当前这个 a 标签中 有 active 这个类，需要切的 a标签 箭头方向
     *  3. 如果当前这个 a 标签中， 没有 active 这个类，添加 active, 其它兄弟元素移除
     *
     *
     * */
    $('.category_Sort a[data-type]').on('click', function () {

        // console.log("12345")
        //保存当前 this
        var $this = $(this);
        if ($this.hasClass("active")) {
            //如果
            // 当前 a 标签中 有 active这个类，需要切换 a 标签 箭头方向
            $this.find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        } else {
            $this.addClass('active').siblings().removeClass("active");
            //让所有箭头向下
           $('.category_Sort a').find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
        //重新渲染数据
        render();
    })


    // mui.init({
    //     /*4.下拉刷新*/
    //     pullRefresh: {
    //         container: ".mui-scroll-wrapper",
    //         down: {
    //             callback: function () {
    //                 /*注意：下拉操作完成之后 业务 */
    //                 /*模拟一次向后台发送请求 响应之后的时间消耗*/
    //                 var that = this;
    //                 /*这个是下拉组件对象  对象当中含有终止下拉操作的方法*/
    //                 /*当前页码*/
    //                 // currPage = 1;
    //                 /*开发真实的业务*/
    //                 render(function () {
    //                     /*下拉效果隐藏*/
    //                     that.endPulldownToRefresh();
    //                 });
    //             }
    //         }
    //     }
    // })
});