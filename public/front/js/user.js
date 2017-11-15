/**
 * Created by Smile on 2017/11/14.
 */

$(function () {

    //发送Aajx 请求 ，获取用户信息
    $.ajax({
        url: '/user/queryUserMessage',
        type: 'GET',
        success: function (backDada) {
            console.log(backDada)

            //调用 判断是否登录
            tools.getCheckLogin(backDada);
            
            //使用模板 渲染用户信息
            $('.userInfo').html(template('infoTmp', backDada));
        }
    })


    //点击退出按钮  注册单击事件
    $('.loginOut').on('click', function () {
        //发送Ajax请求，退出个人中心
        $.ajax({
            url: '/user/logout',
            type: 'GET',
            success: function (backData) {
                console.log(backData);
                //判断如果退出成功，跳转 登录页页
                if (backData.success) {
                    mui.toast("退出成功");
                    location.href = 'login.html';
                }
            }
        })
    });
});