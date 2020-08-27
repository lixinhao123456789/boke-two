$(function(){

    let $image = $("#image");
    let option = {
        aspectRatio:1,
        preview:'.img-preview'
    }
    $image.cropper(option)
    //将input输入框绑定在按钮上面
    $("#btnChooseImage").click(function(){
        $("#file").click();
    })
    //选中一个照片，会触发change事件
    $("#file").change(function(e){
        console.log(e);
        let filelist = e.target.files
        if(filelist.length === 0){
            return layui.layer.msg("请选择一张照片")
        }
        let file = e.target.files[0];

        let imgUrl = URL.createObjectURL(file);

        $image.attr('src',imgUrl)
        //将
        $image.cropper('destroy').attr('src',imgUrl).cropper(option)

        $("#btnUpload").click(function(){
            //得到裁剪区域 并把它转为base64字符串
            // $image.cropper('getCroppedCanvas')  表示获取裁剪的区域 获取裁剪后的canvas对象
            // .toDataURL("image/png") 将canvas对象转换为base64
            let dataURL = $image.cropper('getCroppedCanvas',{
                width:100,
                heigth:100
            }).toDataURL("image/png")
            //发起ajax请求
            //dataURL 表示用户裁剪图片的base64
            $.ajax({
                url:'/auth/updateAvatar',
                method:'post',
                data:{avatar:dataURL},
                success:function(res){
                    if(res.status !== 0){
                        return layui.layer.msg("更换头像失败")
                    }
                    layui.layer.msg("更换头像成功")
                    window.parent.getUserInfo()
                }
            })
        })
    })








})