$(function(){
    //初始化富文本编辑器
    initEditor();
    getArtlist();
    //渲染下拉框
    function getArtlist (){
        $.ajax({
            type:'GET',
            url:'/cauth/cates',
            success:function(res){
                // console.log(res);
                //使用前端模板引擎来渲染页面  template("tpl-table",res) 第一个参数是定义的模板id 第二个参数是获取的数据
                let catslist = template("tpl-cate",res)
                // console.log(catslist);
                $("#form-pub [name='cate_id']").html(catslist); 
                layui.form.render()
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    //设置裁剪的区域
    let $image = $("#image");
    let options = {
        aspectRatio : 400/280,
        preview:'.img-preview'
    }
    //对图片进行裁剪
    $image.cropper(options)
    //绑定点击按钮事件 内部触发input的点击事件
    $("#btnChooseImage").click(function(){
        $("#coverFile").click();
    })
    //输入一张图片，触发change事件
    $("#coverFile").change(function(e){
        //你所选中的图片文件
        let filelist = e.target.files
        if(filelist.length === 0){
            return layui.layer.msg("请选择一张图片")
        }
        //选中图片之后
        //你所选中的图片
        let newimg = URL.createObjectURL(filelist[0])
        $image.cropper('destroy').attr('src',newimg).cropper(options)
    })
    //给草稿按钮注册提交事件
    $("#btnSave2").click(function(e){
        //因为在表单中 所以要清空默认事件
        e.preventDefault();
        let art_state = '未发布'

        let fd = new FormData();
        //富文本中的数据获取
        var con = tinymce.get('emailContent').getContent();
        let t = $("#form-pub [name='title']").val()
        let id = $("#form-pub [name='cate_id']").val()
        fd.append('content',con)
        fd.append('state',art_state);
        fd.append('cate_id',id);
        fd.append('title',t);
        //使用getCroppedCanvas获取截取的图片 放入画布中
        $image.cropper('getCroppedCanvas',{
            width:400,
            height:280,
        }).toBlob(function(blob){      //这片代码是异步的 而ajax也是异步执行的 相当于数据没有放入容器内 ajax请求就发出去了
            fd.append('cover_img',blob)
            //请求服务器 将fordata数据送给数据库
            // console.log(fd.getAll('content'));
            // console.log(fd.getAll('title'));
            addArticle(fd);
        })
    })
    //给表单注册提交事件
    $("#form-pub").submit(function(e){
        let art_state = '已发布'
        e.preventDefault();
        console.log(e.originalEvent);
        // console.log(e.originalEvent.submitter.innerText);
        // if(e.originalEvent.submitter.innerText)
        //打印出来表单中的数据
        // console.log($(this).serialize());
        //创建一个formdata 容器
        // console.log($(this)[0]);
        let fd = new FormData($(this)[0]);
        fd.append('state',art_state);
        //使用getCroppedCanvas获取截取的图片 放入画布中
        $image.cropper('getCroppedCanvas',{
            width:400,
            height:280,
        }).toBlob(function(blob){      //这片代码是异步的 而ajax也是异步执行的 相当于数据没有放入容器内 ajax请求就发出去了
            fd.append('cover_img',blob)
            // console.log(fd.getAll('content'));
            //请求服务器 将fordata数据送给数据库
            addArticle(fd);
        })
    })
    //向服务器发送数据
    function addArticle(da){
        $.ajax({
            type:'POST',
            url:'/cauth/article/add',
            data:da,
            contentType:false, //必须false才会自动加上正确的Content-Type 
            processData:false, //必须false才会避开jQuery对 formdata 的默认处理  XMLHttpRequest会对 formdata 进行正确的处理 
            success:function(res){
                // console.log(res);
                if(res.status !== 0) return layui.layer.msg("插入文章失败")
                window.location.href = './art_list.html'
                layui.layer.msg("插入文章成功",{ icon: 1})
            }
        })
    }
})


















