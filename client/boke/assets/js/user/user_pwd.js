$(function(){
    //自定义验证
    // console.log($(".layui-card [name=newPwd]").val());
    let form = layui.form;
    //密码验证校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,  //\S表示不能为空格 
            '密码必须6到12位，且不能出现空格'
          ] ,
        samePwd:function(value){
            if($(".layui-card [name=oldPwd]").val() == value){
                return '密码和原密码重复'
            }
        },
        rePwd:function(value){
            if($(".layui-card [name=newPwd]").val() !== value){
                return '两次密码不一致'
            }
        }
    })
    $(".layui-form").submit(function(e){
        e.preventDefault();
        //获取表单数据
        var data = layui.form.val('formPwdInfo');
        console.log(data);
        $.ajax({
            url:'/auth/updatepwd',
            type:"POST",
            data:{oldPwd:data.oldPwd,newPwd:data.newPwd},
            success:function(res){
                // console.log(res);
                if(res.status == 1) return layui.layer.msg("原密码输入错误")
                if(res.status !== 0) return layui.layer.msg("密码修改成功")
                layui.layer.msg("密码更新成功")
                localStorage.removeItem("token")
                //往登录页面跳转
                window.parent.parent.location.href='../login.html'
            }
        })
    })
})






























