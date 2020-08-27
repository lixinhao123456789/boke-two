//引入定义校验规则模块
let joi = require("@hapi/joi");

let name = joi.string().required();
let alias = joi.string().alphanum().required();
let id = joi.number().min(1).required()

exports.add_cats_schema ={
    //post请求规则
    body:{
        name,
        alias
    },
    //get请求规则
    // query:{
    //     id
    // }
}

exports.add_editcats_schema ={
    body:{
        name,
        alias,
        id
    }
}







