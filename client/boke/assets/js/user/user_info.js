$(function(){
    initUserinfo();
    //数据回显
    function initUserinfo(){
        $.ajax({
            type: "GET",
            url: "/auth/userinfo",
            success: function (res) {
                // console.log(res);
                if(res.status !== 0 ) return layui.layer.msg("用户信息获取失败")
                layui.form.val('formUserInfo',res.data)
            }
        });
    }
    //重置
    $("#btnReset").click(function(e){
        e.preventDefault();//阻止默认事件
        initUserinfo();
    })
    //提交修改按钮
    $(".layui-form").submit(function(e){
        e.preventDefault();
        // let nickname = $("input[name='nickname']").val();
        // let email = $("input[name='email']").val();
        var data = layui.form.val("formUserInfo");
        // console.log(data);
        $.ajax({
            url:'/auth/userinfo',
            method:'post',
            data:{nickname:data.nickname,email:data.email},
            success:function(res){
                // console.log(res);
                if(res.status !== 0) return layui.layer.msg("更新信息用户失败")
                layui.layer.msg("更新用户信息成功")
                
                //调用index页面中的显示信息方法 对用户信息的显示进行更新
                window.parent.getUserInfo();
            }
        })
    })
})



















