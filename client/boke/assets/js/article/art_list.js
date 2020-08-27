$(function(){
    let p = {
        pagenum:1,
        pagesize:3,
        cate_id:'',
        state:'',
    }
    //定义过滤器
    template.defaults.imports.dataFormat = function(date){
        let dt = new Date(date)
        var y = dt.getFullYear();
        var m = Zero(dt.getMonth()+1);
        var d = Zero(dt.getDay());
        var hh = Zero(dt.getHours());
        var mm = Zero(dt.getMinutes());
        var ss = Zero(dt.getSeconds());
        return y+'--'+m+'--'+d+'--'+hh+':'+mm+':'+ss;
    }
    //补0的函数
    function Zero(n){
        return n>9 ? n : '0'+n;
    }
    //初始化显示文章列表
    getArtcon()
    //查找文章列表
    function getArtcon() {
        $.ajax({
            url:'/cauth/article/list',
            type:"GET",
            data:p,
            success:function(res){
                // console.log(res);
                // if(res.status == 1) return layui.layer.msg("未查到所指定文章列表", {icon: 2})
                //未查到数据
                if(res.status == 1) {
                    let artList = template('tpl-table',res)
                    // console.log(artList);
                    $("table tbody").html(artList)
                    layui.layer.msg("未查到所指定文章列表", {icon: 2})
                }
                // 查询成功
                if(res.status == 0){
                    let artList = template('tpl-table',res)
                    // console.log(artList);
                    $("table tbody").html(artList)
                    //渲染分页
                    renderPage(res.all);
                }
                        
            }
        })
    }
    //渲染分页
    function renderPage(total){
        //执行一个laypage实例
        layui.laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: total //数据总数，从服务端得到
            ,limit:p.pagesize
            ,curr:p.pagenum
            ,layout:['prev', 'limit','page', 'next','skip']
            ,limits:[2,3,5,8,10]
            //obj 
            ,jump:function(obj,first){
                // console.log(obj);
                // console.log("66666");
                p.pagenum = obj.curr;
                p.pagesize = obj.limit;
                // console.log(first);
                if(!first){
                    getArtcon()
                }
            }
        });
    }
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
                $("#cate_id").html(catslist); 
                layui.form.render()
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    //注册筛选事件
    $("#form-search").submit(function(e){
        e.preventDefault();
        // $("#form-search[name='cate_id']").change(function(){  //获取select标签，并注册change事件
		// 	var oV=$(this).find('option:selected').val();//获取选中的option的value值
        // 　　console.log(oV);
		// })
        // let state = $("#form-search[name='state']").val();
        var obj = layui.form.val("form-search");
        // if(obj.cate_id == '' || obj.state == '') return layer.msg("请选择相应的条件")
        // console.log(obj);
        p.cate_id = obj.cate_id,
        p.state = obj.state,
        getArtcon()
    })
    
    //编辑文章列表
    $("table tbody").on('click','.btn-edit',function(){
        let id = $(this).attr("data-id");
        // console.log(id);
        //数据回显
        initArt(id)

    })
    //文章详细数据回显
    function initArt(i){
        $.ajax({
            url:'/cauth/article/',
            type:'GET',
            data:{id:i},
            success:function(res){
                console.log(res.data.title);
                if(res.status !== 0) return layui.layer.msg('获取数据失败');
                window.location.href = './art_pub.html'
                // layui.form.val("form-pub", res.data);
                $("#form-pub [name='title']").val(res.data.title)
                
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    //删除文章
    $("table tbody").on('click','.btn-delete',function(){
        let len = $(".btn-delete").length;
        // console.log(len);
        let id = $(this).attr("data-id");
        layer.confirm('确定删除该文章嘛？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                url:'/cauth/article/delete',
                type:'GET',
                data:'id='+id,
                success:function(res){
                    // console.log(res);
                    if(res.status !== 0) return layer.msg("文章删除失败",{icon: 2})
                    layer.msg("文章删除成功",{icon: 1})
                    if(len == 1) p.pagenum = p.pagenum === 1 ? 1 : p.pagenum-1
                    getArtcon()
                }
            })
            layer.close(index);
          });
    })

})

























