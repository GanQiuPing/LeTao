/**
 * Created by Smile on 2017/11/11.
 */
$(function () {

    //定义分页变量
    var currentPage = 1;
    var pageSize = 5

    //封装函数   发送 ajax请求  获取商品数据
    function render() {
        $.ajax({
            url: '/product/queryProductDetailList',
            type: 'GET',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (backData) {
                console.log(backData);
                // 使用模板  渲染数据
                $('tbody').html(template('productTmp', backData));
            }
        })
    }

    render();

    // 点击 添加商品  弹出模态框  发送Ajax 请求  获取 二级分类数据
    $('.add_product').on('click', function () {
        //显示模态框
        $('#proModal').modal('show');
        //发送Ajax
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'GET',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (backData) {
                console.log(backData);
                $('.dropdown-menu').html(template('proTwoCategoryTmp', backData));
            }
        })
    })

    //选择二级分类名称时，把a标签 内容赋值给 下拉框的文本   （span）
    $('.dropdown-menu').on('click', 'a', function () {
        //把 a 标签 内容 赋值给 下拉框 span
        $('.chooseCategory').text($(this).text());
        // 获取 选择分类的 id  赋值给 隐藏的 id
        $('#brandId').val($(this).data('id'));
        //手动设置 隐藏的 brandId 校验为成功状态
        $form.data("bootstrapValidator").updateStatus("brandId", "VALID");

    })

    //表单验证插件  bootstrapValidator
    // 获取表单
    var $form = $('form');
    $form.bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请选择商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请选择商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请选择商品库存"
                    },
                    //验证不能以0开头  输入数字 最多6位数
                    regexp: {
                        regexp: /^[1-9]\d{0,5}$/,
                        message: "请输入正确的数字，不能小于0"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    },
                    regexp: {
                        regexp: /^[1-9]\d{0,5}$/,
                        message: "请输入正确数字，不能小于0"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价格"
                    },
                    regexp: {
                        regexp: /^[1-9]\d{0,5}$/,
                        message: "请输入正确的数字，不能小于0"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品的尺码(例: 35-40)"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: "请输入正确的尺码格式(例: 38-42)"
                    }
                }
            },
            productLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传三张图片"
                    }
                }
            }
        }
    })

    //图片上传
    $("#fileUpload").fileupload({
        datType: 'json',
        done: function (e, data) {
            console.log(data.result);
            //判断如果图片>=3  return
            if($('.img_box').find('img').length >= 3){
                return false;
            }

            //上传的结果在data.result中  ,每次上传住  img_box追加一张图片
            //设置自定义属性  返回来的 图片地址 图片名称 （因为提交表单时需要拼接字符串）
            $('.img_box').append('<img src="' + data.result.picAddr + '" data-src="' + data.result.picAddr + '" data-picName =' + data.result.picName + ' alt="" width="100px" height="100px">');
            //图片校验 ，判断img_box图片数量  是否等于3，如果是 就成功，否则就失败
            if($('.img_box').find('img').length == 3){
                //手动设置  校验修改为 成功状态
                $form.data("bootstrapValidator").updateStatus('productLogo','VALID');
            }else {
                //手动设置  校验修改为失败状态
                $form.data("bootstrapValidator").updateStatus('productLogo','INVALID');
            }

            //给图片注册一个双击事件
            $('.img_box').find('img').off().on('dblclick',function () {
                //移出图片
                $(this).remove();
                //再次判断 图片数量  是否等于3张
                if($('.img_box').find('img').length == 3){
                    //手动设置  校验修改为成功状态
                    $form.data("bootstrapValidator").updateStatus('productLogo','VALID');
                }else {
                    //手动设置  校验修改为 失败状态
                    $form.data("bootstrapValidator").updateStatus('productLogo','INVALID');
                }
            });
        }
    });

    //表单注册成功事件
    $form.on('success.form.bv', function (e) {
        //阻止默认行为跳转
        e.preventDefault();
        /*
         *   图片地址要求格式：
         *   picName1=1.png&picAddr1=product/1.png
         *  picName2=2.png&picAddr2=product/2.png
         *  picName3=3.png&picAddr3=product/3.png
         * */
        //获取表单中的所有name元素
        var data = $form.serialize();
        //获取到 img_box下所有的图片， 得到picAddr 和  picName ，拼接到 data中
        var $img = $('.img_box img');

        //图片的src在获取时候，会自动拼接上绝对路径， http://localhost,导致前端图片无法正确展示
        // 所以在 图片上传 设置自定义属性 src ，用 dataset 来获取
        /*
         * dataset是 DOM元素 获取自定义属性的 方法 (JS中)
         * data() 是 jQuery 获取 自定义属性方法
         * */

        data += "&picAddr1=" + $img[0].dataset.src + "&picName1=" + $img[0].dataset.picName;
        data += "&picAddr2=" + $img[1].dataset.src + "&picName1=" + $img[1].dataset.picName;
        data += "&picAddr1=" + $img[2].dataset.src + "&picName1=" + $img[2].dataset.picName;

        //发送 Ajax 请求数据，添加商品
        $.ajax({
            url: '/product/addProduct',
            type: 'POST',
            data: data,
            success: function (backData) {
                console.log(backData);
                //判断成功后  需要操作以下功能
                if(backData.success){
                    //  关闭模态框
                    $('#proModal').modal('hide');
                    //重置表单验证 插件
                    $form.data("bootstrapValidator").resetForm();
                    //重置 文本框  是 DOM对象  jQuery对象转为Dom对象
                    $form[0].reset();
                    //设置为第一页  ，因为
                    currentPage = 1;
                    //重新渲染数据
                    render();
                    //设置下拉菜单内容
                    $(".chooseCategory").text("请选择二级分类内容");
                    //清空隐藏的 brandId
                    $("#brandId").val('');
                    //设置为默认图片
                    $('.img_box img').remove();
                    //隐藏的 产品图片
                    $('#productLogo').val('');
                }
            }
        })
    })


});



