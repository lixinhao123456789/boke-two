//引入定义校验规则模块
let joi = require("@hapi/joi");

//定义用户名和密码的校验规则
// alphanum()限定只能是字母或者数字
let username = joi.string().alphanum().min(2).max(10).required();
let password = joi.string().alphanum().min(2).max(10).required();

let nickname = joi.string().required();
let email = joi.string().email().required();

//定义头像信息校验规则
// dataUri() 必选满足 base64 的格式
let avatar = joi.string().dataUri().required();

//reg_login_schema 注册登录表单校验规则对象
exports.reg_login_schema = {
    body:{   //需要对req.body中的数据进行验证
        username,
        password
    }
}

exports.updata_userinfo_schema = {
    body:{   //需要对req.body中的数据进行验证
        nickname,
        email
    }
}

//校验修改密码的规则对象
exports.updata_password_schema = {
    body:{
        //新老密码不能一样
        oldPwd:password,
        newPwd:joi.not(joi.ref("oldPwd")).concat(password)
    }
}

//校验用户头像信息
exports.updata_avatar_schema = {
    body:{
        avatar
    }
}




