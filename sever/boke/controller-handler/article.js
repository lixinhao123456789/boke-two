let db = require("../dao/index")
let path = require("path")
const { count } = require("console")


//增加文章
exports.addArticle = (req,res)=>{
    //此处判断图片是否上传
    if(!req.file || req.file.fieldname !== "cover_img") return res.ss("文章的封面不能为空",2)

    //准备需要入库的数据
    const articleInfo = {
        ...req.body,
        cover_img:path.join('/uploads',req.file.filename),
        pub_date:new Date(),
        author_id:req.user.id
    }
    //准备sql语句
    let sql = 'insert into article set ?'
    db.query(sql,articleInfo,(err,result)=>{
        if(err) return res.ss(err)
        if(result.affectedRows !== 1) return res.ss("发布文章失败")
        res.ss("发布文章成功",0)
    })
}

//删除文章，本质就是修改表中is_delete属性(1表示已删除)
exports.deleteArticle = (req,res)=>{
    // res.ss("deleteArticle")
    let sql = 'update article set is_delete=? where id=?'
    db.query(sql,[1,req.query.id],(err,result)=>{
        if(err) return res.ss(err)
        if(result.affectedRows !== 1) return res.ss("删除文章失败")
        res.ss("删除文章成功",0)
    })
}

//获取文章列表
exports.getArticleList = (req,res)=>{
    // console.log(req.query);
    if(req.query.cate_id&&req.query.state){
        sql = `select*from article where is_delete=0 and cate_id=${req.query.cate_id} and state="${req.query.state}"  limit ${req.query.pagesize} offset ${req.query.pagesize * (req.query.pagenum-1)} `;
    }else if(req.query.cate_id){
        sql=`select*from article where is_delete=0 and cate_id=${req.query.cate_id}  limit ${req.query.pagesize} offset ${req.query.pagesize * (req.query.pagenum-1)} `;
    }else if(req.query.state){
        sql = `select*from article where is_delete=0 and state="${req.query.state}"  limit ${req.query.pagesize} offset ${req.query.pagesize * (req.query.pagenum-1)} `;
    }else{
        sql = `select*from article where is_delete=0  limit ${req.query.pagesize} offset ${req.query.pagesize * (req.query.pagenum-1)} `;
    }
    // var sql = 'SELECT * FROM article where is_delete = ? and state = ? and cate_id = ? limit ' + req.query.pagesize + ' offset ' + req.query.pagesize * (req.query.pagenum - 1);
    // console.log(sql);
    db.query(sql, function (err, result) {
        function ss(result) {
            var num = 'select * from article where is_delete = 0'
            db.query(num,function(err,result2){ 
                if(err) return res.ss(err)
                res.send({
                    status : 0,
                    data:result,
                    all:result2.length
                })
            }) 
        }
        if (err) return res.ss(err)
        // console.log(result);
        if(result.length == 0) return res.send({
            status:'1',
            msg:"未查到所指定文章列表",
            data:[]
        })
        let arr = []
        for (let i in result) {
            let sqlStr = 'SELECT * FROM cats where id = ? and is_delete = 0'
            db.query(sqlStr, result[i].cate_id, (err, result1) => {
                if (err) return res.ss(err)
                result[i].cate_name = result1[0].name;
                let obj = {
                    id:result[i].id,
                    title:result[i].title,
                    pub_date:result[i].pub_date,
                    state:result[i].state,
                    cate_name:result1[0].name,
                }
                arr.push(obj)
                if (i == (result.length) - 1) {
                    ss(arr)
                }
            })
        }
    })
}

//根据id获取文章详情
exports.getArticle = (req,res)=>{
    let sql = 'select * from article where id = ? '
    db.query(sql,req.query.id,(err,result)=>{
        if(err) return res.ss(err)
        // console.log(result);
        res.send({
            "status":0,
            "msg":"获取文章数据成功",
            "data":result[0]
        })
    })
}

//根据id修改文章详细信息
exports.updateArticle = (req,res)=>{
    //此处判断图片是否上传
    if(!req.file || req.file.fieldname !== "cover_img") return res.ss("文章的封面不能为空")
    //准备更新语句
    let sql = 'update article set title=?,content=?,cover_img=?,state=?,cate_id=? where id=?'
    //准备需要入库的数据
    const new_articleInfo = [req.body.title,req.body.content,path.join('/uploads',req.file.filename),req.body.state,req.body.cate_id,req.body.id]
    db.query(sql,new_articleInfo,(err,result)=>{
        if(err) return res.ss(err)
        if(result.affectedRows !== 1) return res.ss("修改文章失败")
        res.ss("修改文章成功",0)
    })
}

