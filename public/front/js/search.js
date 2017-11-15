/**
 * Created by Smile on 2017/11/13.
 */

$(function () {
    /* 获取历史记录 方法
     *localStorage 只能存储字符串， 所以把数据转为字符串再存入 localStorage中
     * 设置localStorage 规则
     * 存储名为： search_history
     * 设置模拟数据： localStorage.setItem("search_history",'["小轩","小王","小厚意"]');
     *
     * 1. 先获取 localStorage
     * 2. 把字符串 转换为 数组
     * 3. 使用 模板引擎 渲染出来
     * */

    // 获取 历史记录 方法
    function getHistory() {
        // 获取 localStorage 记录 ，如果获取记录的是空 返回一个空数组
        var history = localStorage.getItem("search_history") || '[]';
        //返回 历史记录 时  需要把字符串 转换为 数组
        return JSON.parse(history);
    }

    // 渲染历史记录方法
    function render() {
        // 获取 历史记录方法
        var arr = getHistory();
        //结合 模板引擎 渲染数据   注意：需要把数组转为字符串
        $('.history').html(template('historyTmp', {arr: arr}));
    }

    //页面加载时渲染 历史记录
    render();

    // 点击 清空记录按钮   实现 全部清空
    $('.history').on('click', '.btn_clear', function () {
        //提示用户是否确定清空历史记录
        mui.confirm("您确定清空所有历史记录吗?", "温馨提示", ["否", "是"], function (e) {
            if (e.index === 1) {
                console.log(e);  //index = 1 清除，index = 0  取消
                // 调用 清除 localStorage方法
                localStorage.removeItem("search_history");
                //重新渲染数据
                render();
            }
        });
    })

    //点击 删除 X 按钮时，实现选中的 历史记录
    $('.history').on('click', '.btn_del', function () {
        //保存当前this
        var $this = $(this);
        //提示消息
        mui.confirm("您确定删除此记录吗？", "温馨提示", ["取消", "确定"], function (e) {
            if (e.index === 1) {
                //获取到 自定属性的 index  下标
                var index = $this.data('index');
                //获取 历史记录
                var arr = getHistory();
                //使用 splice()方法从数组中添加/删除项目，然后返回被删除项目
                //注意：  会改变原始数组
                /*
                 * pop() :删除最后一个， shift()：删除第一个
                 * push 添加到最后一个   unshift()  添加第一个
                 * slice() 提取 从0 开始，默认截取到最后
                 * */
                //删除当前对应的下标
                arr.splice(index, 1);
                console.log(arr);
                //删除后，记得要存储到localStorage中
                localStorage.setItem("search_history", JSON.stringify(arr));
                //重新渲染数据
                render();
            }
        });
    });

    // 点击 搜索按钮 时，获取 文本框中输入内容
    $('.btn_search').on('click', function () {
        // 获取文本框输入内容  去除两边空格
        var key = $('.search input').val().trim();
        console.log(key);
        //清空文本框的值
        $('.search input').val('');
        //判断是否为空 并提示用户
        if (key.length == 0) {
            mui.toast("请输入搜索内容");
            return false;
        }
        // 获取 历史记录
        var arr = getHistory();
        console.log(arr);

        //判断是否存在相同的关键字，如果存在就删除当前元素，否则添加到数组中
        //获取key在 arr数组中 第一次出现的位置
        var index = arr.indexOf(key);
        //不等于-1存在， indexOf()方法，不存在返回-1的
        if (index != -1) {
            // 存在相同的关键字 ，删除当前元素
            arr.splice(index, 1);
        }
        //判断当前搜索历晚记录大于10条记录时，删除最后（老）的一条数据
        if (arr.length >= 10) {
            arr.pop();
        }
        // 把每次搜索记录添加到 数组第一项 显示 （有相同数据都会执行此代码）
        arr.unshift(key);
        //把数组 转换字符串  存入 localStorage中
        localStorage.setItem("search_history", JSON.stringify(arr));
        //重新渲染数据
        render();

        //让页面跳转到 商品列表页面，并传递当前 文本框中输入的内容
        location.href = "productList.html?key=" + key;
    })

});