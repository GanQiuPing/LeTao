/**
 * Created by Smile on 2017/11/10.
 */
$(function () {
    /*
     *  1.  发送ajax 请求  获取用户数据
     *  2.  结合  模版引擎 渲染数据
     * */


    var currentPage = 1;  //当前页码
    var pageSize = 5;   //每页显示数量

    //封装函数   发送ajax 请求 获取用户数据  渲染到页面上  分页功能
    function render() {
        $.ajax({
            url: '/user/queryUser',
            type: 'GET',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (backData) {
                console.log(backData);
                //使用模板
                var html = template('userTmp', backData);
                //渲染页面上
                $('tbody').html(html);

                /*
                 *   分页功能
                 *   注意：bootstrap 3  一定要用 ul
                 * */
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, //指定版本
                    currentPage: currentPage,   //当前页码
                    totalPages: Math.ceil(backData.total / pageSize),  //总页数
                    //size:"small" //用来指定控件大小  有4个值
                    //点击页码时 触发 click事件  ,有四个参数，我们只用最后一个参数
                    onPageClicked: function (event, originalEvent, type, page) {
                        //把 page 赋值给 当前页
                        currentPage = page;
                        // 重新渲染数据
                        render();
                    }
                })
            }
        })
    }

    // 页面加载  渲染数据
    render();

    //点击  禁用 启用 显示 模态框  ， 发送ajax 请求数据
    $('tbody').on('click', '.btn', function () {
        // console.log(121222);
        //显示模态框
        $('#modal_disabled').modal('show');
        //获取  当前操作的 id
        var id = $(this).parent().data('id');
        // console.log(id);
        //根据id 获取到当前操作的状态  用 类来判断 是否存在
        // var isDelete = $(this).hasClass('.btn-danger') ? 1 : 0;
        var isDelete = $(this).parent().data('delete');
        isDelete = isDelete === 1 ? 0: 1;
        console.log(isDelete)

        //当点击 确定按钮时  发送ajax 请求数据  并更改状态
        $('.btn_disabled').off().on('click',function () {
            //发送ajax
            $.ajax({
                url:'/user/updateUser',
                type:'POST',
                data:{
                    id :id,
                    isDelete : isDelete
                },
                success:function (backData) {
                    console.log(backData);
                    if(backData.success){
                        //关闭模态框
                        $('#modal_disabled').modal('hide');
                        //重新渲染数据
                        render();
                    }
                }
            })
        });
    });

});