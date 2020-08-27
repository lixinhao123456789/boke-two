$(function(){
    //跳转增加分类页面
    $("#btnAddCate").click(function(){
        editIndex = layui.layer.open({
            type: 1, 
            area: ['500px', '250px'],
            content:  $('#dialog-add').html()
        });
    })
    //获取分类数据
    getCatslist()
    function getCatslist() {
        $.ajax({
            type:'GET',
            url:'/cauth/cates',
            success:function(res){
                // console.log(res.data);
                //使用前端模板引擎来渲染页面  template("tpl-table",res) 第一个参数是定义的模板id 第二个参数是获取的数据
                let catslist = template("tpl-table",res)
                // console.log(catslist);
                $(".layui-card-body .layui-table tbody").html(catslist)              
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    //通过事件委托找到相应的编辑按钮
    let editIndex = null
    //编辑分类
    $(".layui-card-body .layui-table tbody").on('click','.btn-edit',function(){
        // console.log("...");
        editIndex = layui.layer.open({
            type: 1, 
            area: ['500px', '250px'],
            content:  $('#dialog-edit').html()
          });
        let id = $(this).attr('data-id')
        // 数据回显
        initCats(id);
    })
    //删除分类
    $(".layui-card-body .layui-table tbody").on('click','.btn-delete',function(){
        let id = $(this).attr('data-id')
        layer.confirm('确定删除该分类嘛？', {icon: 3, title:'提示'}, function(index){
            // let id = $(".btn-delete").attr('data-id')
            // console.log(id);
            $.ajax({
                url:'/cauth/deletecats',
                type:'POST',
                data:{id},
                success:function(res){
                    // console.log(res);
                    if(res.status !== 0) return layui.layer.msg("删除分类失败", {icon: 2})
                    layui.layer.msg("删除分类成功",{icon: 1})
                    //获取分类列表
                    getCatslist();
                }
            })
            layer.close(index);
        });       
    })
    //编辑的数据回显
    function initCats(a){
        $.ajax({
            method: "GET",
            url: "/cauth/getonecats",
            data:"id="+a,
            success: function (res) {
                // console.log(res);
                if(res.status !== 0 ) return layui.layer.msg("查询分类信息失败")
                //将数据渲染在模板中
                layui.form.val('form-edit',res.data[0])
            }
        });
    }
    //修改分类(事件委托)
    $("body").on('submit','#form-edit',function(e){
        e.preventDefault();
        // let name =$("#form-edit input[name='name").val();
        // console.log(name);
        let newdata = layui.form.val("form-edit");
        // console.log(newdata);
        $.ajax({
            url:'/cauth/editcats',
            type:'POST',
            data:{id:newdata.id,alias:newdata.alias,name:newdata.name},
            success:function(res){
                // console.log(res);
                if(res.status == 2 || res.status == 3 || res.status == 4) return layui.layer.msg('分类名称或者别名已存在，请修改', {icon: 2})
                if(res.status !== 0 ) return layui.layer.msg("编辑分类失败", {icon: 2})
                layer.msg('编辑分类成功', {
                    icon: 1,
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                  }, function(){
                    //do something
                    location.href = './art_cate.html'
                    getCatslist()
                  }); 
            },
            error:function(err){
                console.log(err);
            }
        })
    })
    //增加分类
    $("body").on('submit','#form-add',function(e){
        e.preventDefault();
        let addnewdata = layui.form.val("form-add")
        // console.log(addnewdata);
        $.ajax({
            url:'/cauth/addcats',
            type:'POST',
            data:{name:addnewdata.name,alias:addnewdata.alias},
            success:function(res){
                // console.log(res);
                if(res.status == 2 || res.status == 3 || res.status == 4) return layui.layer.msg('分类名称或者别名已存在，请修改', {icon: 2})
                if(res.status !== 0) return layui.layer.msg("添加分类失败", {icon: 2})
                layer.msg('添加分类成功', {
                    icon: 1,
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                  }, function(){
                    //do something
                    location.href = './art_cate.html'
                    getCatslist()
                  });     
            }
        })
    })

})


















