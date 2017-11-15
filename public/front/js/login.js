/**
 * Created by Smile on 2017/11/14.
 */
$(function () {

    // 给登录按钮注册单击事件
    $('.btnLogin').on('click', function () {
        // console.log(location.search);
        // 获取用户名 和  密码
        var username = $('[name=username]').val();
        var password = $('[name= password]').val();


        //非空判断  用户名 和 密码
        if (!username) {
            mui.toast("请输入用户名");
            return false;
        }
        if (!password) {
            mui.toast("请输入密码");
            return false;
        }
        //发送 Ajax 请求 ，获取用户登录数据
        $.ajax({
            url: '/user/login',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function (backData) {
                console.log(backData);
                //判断用户登录后 两种状态
                if (backData.success) {
                    //获取地址栏参数
                    var search = location.search;
                    //如果没有参数直接跳转到 会员心
                    if (search.indexOf("backUrl") == -1) {
                        location.href = 'user.html';
                    } else {
                        //如果有参数，说明返回进来对应页面
                        search = search.replace("?backUrl=", '');
                        console.log(search)
                        location.href = search;
                    }
                } else if (backData.error === 403) {
                    mui.toast(backData.success);
                }

            }
        })

    })


});