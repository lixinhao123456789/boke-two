$(function(){
    $("#link_reg").click(function(){
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").click(function(){
        $(".login-box").show();
        $(".reg-box").hide();
    })
    //自定义验证
    let form = layui.form;
    form.verify({
        password: [
            /^[\S]{6,12}$/,  //\S表示不能为空格 
            '密码必须6到12位，且不能出现空格'
          ] ,
        repwd:function(value){
            if($(".reg-box [name=password]").val() !== value){
                return '两次密码不一致'
            }
        }
    })

    //注册用户名点击事件
    $("#form_reg").submit(function(e){
        e.preventDefault();
        let data = {
            username:$(".reg-box [name=username]").val(),
            password:$(".reg-box [name=password]").val(),
        }
        console.log(data);
        $.post('/api/register',data,function(res){
            if(res.status !== 0){
                return layer.msg(res.msg)
            }
            layer.msg(res.msg)
            //模拟人为点击
            $("#link_login").click()
        })
    })


    //登录点击事件
    $("#form_login").submit(function(e){
        e.preventDefault();
        // $.post("/api/login",$(this).serialize(),function(res){
        //     console.log(res);
        //     if(res.status !== 0) return layer.msg(res.msg, {icon: 5});
        //     // layer.msg('恭喜你，登录成功！', {icon: 6})
        //     localStorage.setItem("token",res.token)
        //     layer.msg('恭喜你，登录成功', {
        //         icon: 1,
        //         time: 1000 //1秒关闭（如果不配置，默认是3秒）
        //       }, function(){
        //         location.href="./index.html"
        //       }); 
        // })
        $.ajax({
            type: "post",
            url: "/api/login",
            data: $(this).serialize(),
            // dataType: "dataType",
            success: function (res) {
                if(res.status !== 0) return layer.msg(res.msg)
                layer.msg("恭喜你，登录成功")
                localStorage.setItem("token",res.token)
                location.href='./index.html'
            }
        });
    })
})