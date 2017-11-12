/**
 * Created by Smile on 2017/11/12.
 */
$(function () {

    //发送Ajax请求  获取 左边 菜单列表（一级分类）数据
    $.ajax({
        type:'GET',
        url:'/category/queryTopCategory',
        success:function (backData) {
            console.log(backData);
            //使用模板引擎  渲染页面数据
            $('.menuNav_left .mui-scroll').html(template('categoryTmp_l',backData));

            //页面加载时 默认显示第一个选中状态 的 数据
            secondCategory(backData.rows[0].id);
        }
    })

    //封装 二级分类的函数  并传入 id值
    function secondCategory(id) {
        $.ajax({
            url:'/category/querySecondCategory',
            type:'GET',
            data:{
                id:id
            },
            success:function (backData) {
                console.log(backData);
                //使用 模板引擎  渲染数据
                $('.brandShow_right .mui-scroll').html(template('brandShowTmp',backData));
            }
        })
    }

    //点击每个左边菜单的每个li标签 注册委托事件    获得当前id ,查询对应数据
    $('.mui-scroll').on('click','li',function () {
        //给当前选中的 li添加 active ,其他兄弟元素 移除 active
        $(this).addClass('active').siblings().removeClass('active');
        var id = $(this).data('id');
        secondCategory(id);

        //获取 页在滚动实例，页面上有2个 （左 右），我们要 第2个 滚动到 顶部 ，所以[1]
        //滚动到特定位置   100毫秒滚动到 0 0位置
        mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0,0,100);

    })
})















