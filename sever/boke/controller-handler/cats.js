let db = require("../dao/index")

//获取分类列表
exports.getCats = (req,res)=>{
    // res.send(".........")
    //获取的数据以id为升序排序
    let sql = 'select * from cats where is_delete=0 order by id asc'
    db.query(sql,(err,result)=>{
        if(err) return res.ss(err)
        res.send({
            status:0,
            msg:"获取分类数据成功",
            data:result
        })
    })
}
//增加分类
exports.addCats = (req,res)=>{
    // res.send("niaho")
    let sql = 'select * from cats where is_delete=0 and (name=? or alias = ?)'
    db.query(sql,[req.body.name,req.body.alias],(err,result)=>{
        if(err) return res.ss(err)
        console.log(result);
        //判断数据库中是否有准备插入的数据
        if(result.length == 1 && result[0].alias == req.body.alias && result[0].name == req.body.name) return res.ss("该图书名称和别名都已存在，请重新输入",2)
        if(result.length == 1 && result[0].name == req.body.name) return res.ss("该图书名称已存在，请重新输入",3)
        if(result.length == 1 && result[0].alias == req.body.alias) return res.ss("该图书别名已存在，请重新输入",4)
        if(result.length == 2) return res.ss("该图书名称和别名都已存在，请重新输入",2)
        let addsql = 'insert cats set ?'
        db.query(addsql,req.body,(err,result)=>{
        if(err) return res.ss(err)
        if(result.affectedRows !== 1) return res.ss("插入失败")
        res.ss("恭喜你，分类插入成功",0)
    })
    })
}
//删除分类
exports.deleteCats = (req,res)=>{
    //第一种方式
    let sql = 'update cats set is_delete=? where id = ?'
    db.query(sql,[1,req.body.id],(err,result)=>{
        if(err) return res.ss(err)
        if(result.affectedRows !== 1 ) res.ss("删除分类失败")
        res.ss("删除分类成功",0)
    })
    // 第二种方式
    // let sqlStr = 'select id from cats where name = ?'
    // db.query(sqlStr,req.body.name,(err,result)=>{
    //     if(err) return res.ss(err)
    //     if(result.length !== 1) return res.ss('未查询到该分类数据')
    //     console.log(result.id);
    //     let sql = 'update cats set is_delete=? where id = ?'
    //     db.query(sql,[1,result[0].id],(err,result)=>{
    //         if(err) return res.ss(err)
    //         if(result.affectedRows !== 1 ) res.ss("删除分类失败")
    //         res.ss("删除分类成功")
    //     })
    // })
}
//编辑分类
exports.editCats = (req,res)=>{
    let sql = 'select * from cats where is_delete=0 and id<>? and (name=? or alias = ?)'
    db.query(sql,[req.body.id,req.body.name,req.body.alias],(err,result)=>{
        if(err) return res.ss(err)
        console.log(result);
        //判断数据库中是否有准备插入的数据
        if(result.length == 1 && result[0].alias == req.body.alias && result[0].name == req.body.name) return res.ss("该图书名称和别名都已存在，请重新输入",2)
        if(result.length == 1 && result[0].name == req.body.name) return res.ss("该图书名称已存在，请重新输入",3)
        if(result.length == 1 && result[0].alias == req.body.alias) return res.ss("该图书别名已存在，请重新输入",4)
        if(result.length == 2) return res.ss("该图书名称和别名都已存在，请重新输入",2)
            let sqlStr = 'update cats set name = ?,alias = ? where id = ?'
            let content = [req.body.name,req.body.alias,req.body.id]
            db.query(sqlStr,content,(err,result)=>{
                if(err) return res.ss(err)
                if(result.affectedRows !== 1) return res.ss("编辑分类失败")
                res.ss("编辑图书成功",0)
            })
        })   
}
//分类数据回显
exports.getOnecats = (req,res)=>{
    // console.log("hiuxian");
    let sql = 'select * from cats where id = ?'
    db.query(sql,req.query.id,(err,result)=>{
        if(err) return res.ss(err)
        if(result.length !== 1) res.ss("查询分类失败")
        res.send({
            status:0,
            msg:"查询数据成功",
            data:result
        })
    })
}

