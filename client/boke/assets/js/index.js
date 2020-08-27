$(function(){
    //调用获取信息方法
    getUserInfo();

    //退出登录
    $("#btnLogout").click(function(){
        layui.layer.confirm('确定退出嘛？',{icon:3,title:'提示'},function(index){
            //清空token
            localStorage.removeItem('token')
            //调到登录页面
            location.href='./login.html'
            layer.close(index)
        })
    })
})

    //获取用户信息
    function getUserInfo(){
        // $.get('/auth/userinfo',function(res){
        //     console.log(res);
        //     if(res.status !== 0){
        //         return layui.layui.msg("获取用户信息失败")
        //     }
        //     //渲染头像
        //     rederAvatar(res.data)
        // })
        $.ajax({
            type: "GET",
            url: "/auth/userinfo",
            success: function (res) {
                // console.log(res);
                if(res.status !== 0 ){
                    return layui.layer.msg("获取用户信息失败！")
                }
                rederAvatar(res.data)
            }
        });
    }
    //渲染头像信息
    function rederAvatar(user){
        //如果没有别名就用用户名 如果有就用别名
        let name = user.nickname || user.username;
        $("#welcome").html('欢迎 '+name)
        if(user.user_intro !== null){
            $(".text-avatar").hide()
            $(".layui-nav-img").attr('src',user.user_intro).show();
        }else{
            //name[0].toUpperCase() name的首字母大写
            $(".text-avatar").html(name[0].toUpperCase()).show()
            $(".layui-nav-img").hide()
        }
    }    














