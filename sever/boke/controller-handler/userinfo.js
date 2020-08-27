let db = require("../dao/index");
let bcryptjs = require("bcryptjs");
const { response } = require("express");
const expressJoi = require("@escook/express-joi");

//获取用户信息
exports.getUserInfo = (req,res)=>{
    // res.send("nihao")
    var sql = "select * from user where id=?"
    db.query(sql,req.user.id,function(err,result){
        if(err) return res.ss(err);
        if(result.length !==1 ) return res.ss("获取用户信息失败",1)
        res.send({
            status:0,
            msg:"获取用户信息成功",
            data:result[0]
        })
    })
}

//修改用户信息
exports.updateUserInfo = (req,res)=>{
    // res.send("nihao")
    //准备sql语句
    var sql = 'update user set nickname=?,email=? where id=?'
    var mod = [req.body.nickname,req.body.email,req.user.id]
    db.query(sql,mod,function(err,result){
        if(err) return res.ss(err)
        if(result.affectedRows !== 1) return res.ss("更新用户信息失败")
        res.ss("更新用户成功",0)
    })
    console.log("...");
}

//修改密码
exports.updatePassword = (req,res)=>{
    // res.send(".....")
    let sql = "select * from user where id=?"
    db.query(sql,req.user.id,(err,result)=>{
        if(err) return res.ss(err)
        if(result.length !==1 ) return res.ss("用户不存在")

        //判断密码是否正确
        let compareRes = bcryptjs.compareSync(req.body.oldPwd,result[0].password);
        if(!compareRes) return res.ss("原密码输入错误")

        //如果密码正确 则对密码进行加盐算法处理
        let newPwd = bcryptjs.hashSync(req.body.newPwd,10)
        //准备把新密码入库
        let sql = "update user set password=? where id=?"
        db.query(sql,[newPwd,req.user.id],(err,result)=>{
            if(err) return res.ss(err)
            if(result.affectedRows !== 1) return res.ss("密码更新失败")

            //成功的话
            res.ss("密码更新成功啦！！！",0)
        })
    })
}

//修改头像信息
exports.updateAvatar = (req,res)=>{
    // console.log('updateAvatar');
    // res.ss("ni")
    let sql ='update user set user_intro=? where id =?'
    db.query(sql,[req.body.avatar,req.user.id],(err,result)=>{
        if(err) return res.ss(err)
        if(result.affectedRows !== 1) return res.ss("头像信息更新失败")
        return res.ss("头像信息更新成功",0)
    })
}






