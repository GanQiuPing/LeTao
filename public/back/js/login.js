/**
 * Created by Smile on 2017/11/8.
 */

$(function () {
    /*
     * 登录 验证规则：
     *   1. 用户名不能为空
     *   2. 密码不能为空 ，长度大于6位 小于 12位
     * */

    // 获取 表单
    var $form = $('form');
    // console.log($form)

    //使用   校验表单插件 bootstrapValidator
    $form.bootstrapValidator({
        // 校验状态  右侧显示小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //字段   对应表单的name属性
        fields: {
            //验证用户名  不能为空
            username: {
                validators: {
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    callback: {
                        message: "用户名错误"
                    }
                }
            },
            //验证密码  不能为空
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    //    验证密码长度 大于 6位 小于 12位
                    stringLength: {
                        min: 6,
                        max: 12,
                        massage: "密码长度6-12之间"
                    },
                    //密码错误提示
                    callback:{
                        message:"密码有误，请重新输入"
                    }
                }
            }
        }
    })

    // 给表单注册一个校验成功事件  成功后触发  使用ajax提交
    $form.on('success.form.bv', function (e) {
        //    阻止默认行为
        e.preventDefault();
        //    使用Ajax发送登录请求
        $.ajax({
            url:"/employee/employeeLogin",
            type: 'post',
            data: $form.serialize(),
            success: function (backData) {
                console.log(backData)

                //    判断成功时 跳转主页
                if (backData.success) {
                    location.href = "index.html";
                }

                //    使用 updateStatus 方法  可以指定某个字段校验状态
                    /*   三个参数：
                         1.  字段名  表单中属性
                         2. INVALID  校验状态
                         3. 提示信息
                     */

                //    如果返回是 1000 代表用户名  错误
                if (backData.errno == 1000) {
                    $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }

                // 如果 返回是 1001 代表密码 错误
                if(backData.error == 1001){
                    $form.data("bootstrapValidator").updateStatus("password","INVALID","callback");
                }
            }
        })
    })

    //表单重置
    $('[type="reset"]').on('click',function () {
        //获取 validator 对象 ，获取 resetForm() 方法
        $form.data("bootstrapValidator").resetForm();
    })
});