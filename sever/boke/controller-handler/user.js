let db = require("../dao/index")
let bcryptjs = require("bcryptjs")
let jwt = require("jsonwebtoken")
let config = require("../schema/config")

//用户注册
exports.regUser = (req,res)=>{
    // res.send("reg...")
    //获取客户端提交的用户信息
    let userInfo = req.body;
    //检测是否为空
    if(!userInfo.username || !userInfo.password){
        return res.ss("用户名或密码不能为空",3)
    }
    //检测用户名是否存在
    var sql = 'select * from user where username=?';
    //第一个传sql语句 第二个传查询值
    db.query(sql,userInfo.username,function (err, result) {
        if(err){
          return res.send({
              status:1,
              msg:err.measure
          })
        }
        if(result.length>0){
            return res.ss("用户名已存在，请重新输入",2)
        }

        //对用户的密码进行加密，hashSync加盐算法 10随机盐的长度
        userInfo.password = bcryptjs.hashSync(userInfo.password,10)
        console.log(userInfo.password);
        const addSql = "insert into user set ?"  //?表示占位符
        //注册数据
        db.query(addSql,{username:userInfo.username,password:userInfo.password},function (err, result) {
            if(err){
             return res.send({
                 status:1,
                 msg:err.measure
             })
            }  
            if(result.affectedRows !==1 ){
                return res.ss("用户注册失败，请重试...")
            }
            return res.ss("用户注册成功",0)     
        });
 
    });

    
}
//用户登录
exports.login = (req,res)=>{
    //接受传递过来的数据
    let userInfo = req.body;
    const sql = 'select * from user where username =?';
    db.query(sql,userInfo.username,function (err, result) {
        if(err){
          return res.ss(err);
        }
        // console.log(result);
        if(result.length !== 1){
            return res.ss("用户不存在，登录失败")
        }
        //拿着用户的密码和数据库中的密码进行比较  一样就true 不一样false
        let compareRes = bcryptjs.compareSync(userInfo.password,result[0].password)
        // console.log(compareRes);
        if(!compareRes){
            return res.ss("密码错误，登录失败")
        }

        //登录成功
        //...result[0] 表示对数组里面对象展开  设置password属性为空，和user-intro属性也为空
        let user = {...result[0],'password':'','user-intro':'','user_intro':''}
        // 生成的token也可以包含密码和头像信息
        let tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
        res.send({
            status:0,
            msg:"登录成功",
            token:"Bearer "+tokenStr
        })
});
}

