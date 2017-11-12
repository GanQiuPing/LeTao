/**
 * Created by Smile on 2017/11/10.
 */

$(function () {
    /*
     * 一级分类
     *   1. 发送 ajax  结合模板引擎  渲染数据
     *   2. 分页功能
     *   3. 添加分类
     *       a. 点击添加分类 弹出模态框
     *       b. 弹出模态框  静态页面布局
     *       c. 表单校验插件
     *       d. 当用户 点击 “确定” 按钮时，
     *           注册表单成功事件  $form.on('success.form.bv',function(){});
     *       f:  发送ajax 阻止 默认行为 ，判断添加成功后  设置为第一页  重新渲染数据
     * */

    // 定义变量
    var currentPage = 1;
    var pageSize = 5;

    // 封装函数
    function render() {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            type: 'GET',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (backData) {
                console.log(backData);
                // 使用 模板引擎  渲染数据
                $('tbody').html(template('addCategoryTmp', backData));

                //分页功能
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,  //指定版本 使用ul 渲染
                    currentPage: currentPage, // 当前页数
                    totalPages: Math.ceil(backData.total / pageSize),//总页数
                    // 当点击页码时，触发事件   前面三个参数现在用不到，我们只要拿到第四个参数
                    onPageClicked: function (event, originlEvent, type, page) {
                        // 设置当前页码为第一页 (因为添加成功后 显示 第一页)
                        currentPage = page;
                        //重新渲染数据
                        render();

                    }
                })
            }
        })
    }

    //调用 函数  页面加载时 显示默认数据
    render();

    // 点击 添加分类  显示 模态框
    $(".add_category").on('click', function () {
        //显示 模态框
        $("#modal_addCategories").modal('show');
    })

    // 表单较验   使用 bootstrapValidator 插件
    //获取 表单
    var $form = $('form');
    $form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "分类名称不能为空"
                    }
                }
            }
        }
    })

    // 点击确认按钮时   注册表单成功事件  发送ajax
    $form.on('success.form.bv', function (e) {
        //阻止默认行为
        e.preventDefault();
        // 发送 ajax 获取 一级分类数据
        $.ajax({
            url: '/category/addTopCategory',
            type: 'POST',
            data: $form.serialize(),
            success: function (backData) {
                console.log(backData);
                //判断 如果成功后  隐藏 模态框
                if (backData.success) {
                    // 隐藏 模态框
                    $('#modal_addCategories').modal('hide');
                    //把当前页设置为第一页
                    currentPage = 1;
                    // 重新渲染数据
                    render();
                    //重置 表单样式
                    $form.data('bootstrapValidator').resetForm();
                    //重置文本内容   使用 Dom元素的 reset()方法   所以要转为 Dom元素去调用
                    $form[0].reset();
                }
            }
        })
    });


});