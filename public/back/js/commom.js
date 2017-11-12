/**
 * Created by Smile on 2017/11/8.
 */

//Ajax 6个  全局事件
// 实现打开页面 有进度条效果  使用插件NProgress

//右边 不显示 进度环 （小圈圈）
NProgress.configure({showSpinner: false});
//开启 ajaxStart
$(document).ajaxStart(function () {
    //进度条开始方法
    NProgress.start();
});
//停止 ajaxStrop
$(document).ajaxStop(function () {
    //定义计时器 设置时间
    setTimeout(function () {
        //进度条 结束方法
        NProgress.done();
    }, 500);
});


/*非登录 验证
 *  页面一加载时，先发送 判断用户是否登录 ，如果没有登录跳转到登录页面，否则进入index页面
 * */
if (location.href.indexOf('login.html') == -1) {
    $.ajax({
        url: '/employee/checkRootLogin',
        success: function (backData) {
            //判断如果返回 400 ，说明没有登录
            if (backData.error === 400) {
                location.href='login.html';
            }
        }
    })
}

//分类管理  隐藏显示
$('.child').prev().on('click',function () {
    $(this).next().slideToggle();
});

//侧边栏 显示隐藏
$('.btn_menu').on('click',function () {
    //显示隐藏  左侧边栏
    // $('.aside_left').toggle();
    $('.aside_left').toggleClass('now')
    //右侧边栏 显示隐藏
    $('.aside-right').toggleClass('now');
    // 右边 导航菜单 切换
    $('.topbar').toggleClass('now');
});


//退出功能
$('.btn_loginOut').on('click',function () {
    $('#modal_loginOut').modal('show');

    //如果直接on 事件会叠加， 前面加off()事件  解绑所有事件
    //off('click')只解绑单击事件
    $('.btn-confirm').off().on('click',function () {
        $.ajax({
            url:'/employee/employeeLogout',
            success:function (backData) {
                console.log(backData)
                if(backData.success){
                    location.href='login.html';
                }
            }
        })
    })
});

