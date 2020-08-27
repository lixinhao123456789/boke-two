//引入定义校验规则模块
let joi = require("@hapi/joi");

let title = joi.string().required();
let content = joi.string().required().allow('');
let state = joi.string().valid('已发布','未发布').allow('');
let cate_id = joi.number().integer().min(1).allow('');
let id = joi.number().min(1).required();
let pagenum = joi.number().integer().min(1).required();
let pagesize = joi.number().integer().min(1).required();

//增加图书的验证规则
exports.add_article_schema = {
    body:{
        title,
        content,
        state,
        cate_id
    }
}
//获取和删除图书的验证规则
exports.getAnddelete_article_schema = {
    query:{
        id
    }
}
//更新文章详细信息的验证规则
exports.update_article_schema = {
    body:{
        id,
        title,
        content,
        state,
        cate_id
    }
}
//获取文章列表所传参数的验证规则
exports.list_article_schema = {
    query:{
        pagenum, //第几页
        pagesize, //每页显示多少条
        cate_id, //分类号
        state, //状态 已发布/未发布
    }
}
//根据页码和一页显示的个数获取文章列表的验证规则
exports.articlelist_article_schema = {
    query:{
        pagenum, //第几页
        pagesize, //每页显示多少条
    }
}