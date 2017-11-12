/**
 * Created by Smile on 2017/11/10.
 */
$(function () {
    /*
     * 二级分类:
     *   1. 页面加载 展示当前页数据 ，结合模板引擎 渲染数据
     *   2. 分页功能
     *   3. 点击添加分类 ： 弹出模态框
     *   4. 弹出模态框的  静态页面布局
     *       a.下拉菜单 ，用点击button ，把数据渲染到 菜单下的ul中
     *       b. 当选中某一个分类名称时 ，获取当前选中的id  （在表单上需要添加一个隐藏的 input:hidden）
     *  5. 上传文件 把 type设置为
     *       a.（因为file的默认样式不太好看，用了 button按钮样式 ，把文件按钮定位到button上，上面看到是 button,
     *           下面是 file 原有按钮， 把file 透明显示 ）
     *
     *       b.（当用户选择图片时，偷偷发送Ajax到后台，后台把图片存储起来，返回图片地址，拿到图片地址展示在页面上预览图片）
     *   file   在表单上添加一个 input:hidden 隐藏
     *      c. 把图片地址放在 隐藏域中  data.result.picAddr
     * */

    //定义分页变量
    var currentPage = 1;
    var pageSize = 5

    // 封装函数
    function render() {
        // 发送 ajax 请求 ，获取二级分类 数据
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'GET',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (backData) {
                console.log(backData)
                //结合模板引擎  渲染数据
                $('tbody').html(template('twoCategoryTmp',backData));

                // 分页功能
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(backData.total / pageSize),
                    // 当点击页码时，触发事件   前面三个参数现在用不到，我们只要拿到第四个参数
                    onPageClicked:function (event,originalEvent,type,page) {
                        //把 点击 page 赋值给 当前页
                        currentPage = page;
                        // 重新渲染数据
                        render();
                    }
                })
            }
        })
    }

    //页面加载时 展示数据
    render();


    // 当点击 添加分类  ，弹出模态框   获取下拉 一级分类数据
    $('.add_category').on('click',function () {
        $('#modal_addCategories').modal('show');

        //当点击 一级分类 button时，发送 ajax请求 获取 数据 ，（因为接口不够细致，用了 一级分类接口,所以把 两个参数写固定数据，但不影响）
        // $('.chooseCategory').off().on('click',function () {
            $.ajax({
                url:'/category/queryTopCategoryPaging',
                type:'GET',
                data:{
                    page: 1,
                    pageSize: 100
                },
                success:function (backData) {
                    console.log(backData)
                    //使用 模板引擎  渲染数据在页面上
                    $('.dropdown-menu').html(template('addCategoryTmp',backData));
                }
            })
        // });

    });


    // 获取当选中下拉菜单 的某个 分类时，获取当前 id , 把选中的值 赋值给 button (在表单隐藏 文本域 来获取id)
    $('.dropdown-menu').on('click','a',function () {
        //点击 a 标签分类时，把值 赋给 button 的 span 修改内容 (也就是显示一级分类名称的 span)
        $('.chooseCategory').text($(this).text());
        //当前 选中分类名称  获取自定义属性的id （在表单中隐藏 id ）
        $('#categoryId').val($(this).data('id'));
        //手动设置 categoryId   用 js动态 改变 校验成功状态    使用 updateStatus方法
        $form.data('bootstrapValidator').updateStatus('categoryId','VALID');

    });

     // 上传图片
    $("#fileUpload").fileupload({
        dataType:"json",
        //文件上传完成时，会执行的回调函数，通过这个回调函数获取图片地址
        // 第二个参数中 有上传的结果，里面有个 result
        done:function (e,data) {
            console.log("亲，图片上传完成啦");
            console.log(data.result);   //得到 result
            console.log(data.result.picAddr)  //得到返回来的图片地址  /upload/brand/0200a6a0-c6ca-11e7-905c-21fb6c0547d5.jpg
            //返回来的地址  设置给img 图片的 src
            $('.img_box img').attr('src',data.result.picAddr);
            //把图片地址设置给 隐藏的 brandLogo
            $('#brandLogo').val(data.result.picAddr);
            // 手动设置  用js动态改成校验成功状态
            $form.data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });


    /*表单校验 使用 bootstrapValidator 插件
    *   1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    *     excluded: [':disabled', ':hidden', ':not(:visible)'],
    * */

    //获取 表单
    var $form = $('form');
    //注册 bootstrapValidator 事件
    $form.bootstrapValidator({
        // 设置所有都校验
        excluded:[],
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid:'glyphicon glyphicon-remove',
            validating:'glyphicon glyphicon-refresh'
        },
        //验证字段
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:"请选择一级分类"
                    }
                }
            },
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"请输入二级分类名称"
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:"请选择上传的图片"
                    }
                }
            }
        }
    });

    //注册表单验证成功事件  成功后 发送 Ajax 请求  添加二级分类
    // 使用 $form.serialize() 获取所有表单元素
    $form.on('success.form.bv',function (e) {
        //阻止默认行为
        e.preventDefault();
        //发送 ajax
        $.ajax({
            url:'/category/addSecondCategory',
            type:'POST',
            data:$form.serialize(),
            success:function (backData) {
                console.log(backData);
                /*
                * 判断添加分类成功后
                *   1. 隐藏模态框
                *   2. 设置当前页为 第一页
                *   3. 重新渲染数据
                * */
                if(backData.success){
                    // 隐藏模态框
                    $('#modal_addCategories').modal('hide');
                    //设置当前页为 第一页
                    currentPage = 1;
                    // 重新渲染数据
                    render();
                    // 重置表单插件验证样式
                    $form.data('bootstrapValidator').resetForm();
                    // 重置 input 表单样式 （隐藏的 id  图片）
                    $form[0].reset();  //reset()是DOM元素方法
                    // 修改 下拉菜单显示文本内容
                    $('.chooseCategory').text('请选择一级分类');
                    //清空 隐藏的 品牌logo
                    $('#brandLogo').val('');
                    //把图片 设置为 默认图片显示
                    $('.img_box img').attr('src','images/none.png');
                    //清空 隐藏的  分类id
                    $('#categoryId').val('');
                }
            }
        })
    });

});