let express = require("express");
let router = express.Router();
//引入controller
let articleHandler = require("../controller-handler/article")

//配置multer解析表表单中的数据（主要是图片数据）
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// 导入数据校验的中间件
let expressJoi = require("@escook/express-joi")
//导入数据校验规则对象
let { add_article_schema,getAnddelete_article_schema,update_article_schema,list_article_schema, articlelist_article_schema } = require("../schema/article");

//upload.single('cover_img')就是个中间件 来解析表单中的数据的
//此时如果是文本数据，就在req.body中
//如果是图片，就在req.file中存储

//根据id获取文章详情
router.get('/',expressJoi(getAnddelete_article_schema),articleHandler.getArticle)

//增加文章
router.post('/add',upload.single('cover_img'),expressJoi(add_article_schema),articleHandler.addArticle)

//显示文章列表
router.get('/list',expressJoi(list_article_schema),articleHandler.getArticleList)

//根据id删除文章
router.get('/delete',expressJoi(getAnddelete_article_schema),articleHandler.deleteArticle)

//根据id修改文章详细信息
router.post('/update',upload.single('cover_img'),expressJoi(update_article_schema),articleHandler.updateArticle)

module.exports = router;