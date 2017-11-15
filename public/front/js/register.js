/**
 * Created by Smile on 2017/11/14.
 */
$(function () {

    /* 点击 获取验证码时，发送 Ajax 请求，获取验证码 （模拟）
     * 实际开发过程中，服务器随机一个验证码，自己保存起来，把验证码和一些信息给到 第三方运营商，
     * 然后直接发送到用户手机上，服务器告诉你发送成功
     * */
    $('.getCode button').on('click', function () {
        //保存当前this
        var $this = $(this);
        //禁用 按钮
        $this.addClass('disabled').prop('disabled', true).html('正在发送中...');

        //发送 Ajax请求 ，获取验证码
        $.ajax({
            url: '/user/vCode',
            type: 'GET',
            success: function (backData) {
                //输出返回来验证码
                console.log(backData.vCode);
                // 定义变量倒计时间
                var time = 5;
                //定义计时器
                var timeId = setInterval(function () {
                    time--;
                    $this.html("还有" + time + "秒,再次发送");
                    if (time <= 0) {
                        $this.removeClass('disabled').prop('disabled', false).html('获取验证码');
                        //清除计时器
                        clearInterval(timeId);
                    }
                }, 1000)
            }
        })
    })


    // 给注册按钮注册点击事件，完成注册
    $('.btnRegister').on('click', function () {

        // 获取表单元素
        var username = $('[name=username]').val();
        var password = $('[name = password]').val();
        var rePassword = $('[name= rePassword]').val();
        var mobile = $('[name = mobile]').val();
        var vCode = $('[name = vCode]').val();

        // 点击 注册按钮  校验表单字段
        //非空 判断
        if (!username) {
            mui.toast("请输入用户名");
            return false;
        }
        if (!password) {
            mui.toast("请输入密码");
            return false;
        }
        //判断密码长度 6-20字母、数字或下划线
        var pwdReg = /^(\w){6,20}$/;
        if (!pwdReg.test(password)) {
            mui.toast("密码长度6-20字母、数字或下划线");
            return false;
        }
        if (!rePassword) {
            mui.toast("确认密码不能为空");
            return false;
        }
        //判断原密码跟确认密码要匹配
        if (password != rePassword) {
            mui.toast("两次密码不一致");
            return false;
        }

        if (!mobile) {
            mui.toast("手机号不能为空");
            return false;
        }

        //使用正则验证手机号 格式
        var mobileReg = /^1[34578]\d{9}$/;
        if (!mobileReg.test(mobile)) {
            mui.toast("请输入正确手机格式");
            return false;
        }

        if (!vCode) {
            mui.toast("验证码不能为空");
            return false;
        }

        // 发送 Ajax 请求，注册用户
        $.ajax({
            url: '/user/register',
            type: 'POST',
            data: {
                username: username,
                password: password,
                mobile: mobile,
                vCode: vCode
            },
            success: function (backData) {
                console.log(backData);
                //判断返回状态
                if(backData.error){
                    mui.toast(backData.message);
                }else if(backData.success){
                    mui.toast("恭喜您，注册成功");
                    setTimeout(function () {
                        location.href = 'login.html';
                    },1000)
                }
            }
        })
    })
});