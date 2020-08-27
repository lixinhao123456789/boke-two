let express = require("express")
let router = express.Router();
//引入controller
let catsHandler = require("../controller-handler/cats")
// 导入数据校验的中间件
let expressJoi = require("@escook/express-joi")
//导入数据校验规则对象
let { add_cats_schema, add_editcats_schema } = require("../schema/cats")

//获取分类数据
router.get('/cates',catsHandler.getCats)

//新增分类
router.post('/addcats',expressJoi(add_cats_schema),catsHandler.addCats)

//删除分类
router.post('/deletecats',catsHandler.deleteCats)

//编辑分类
router.post('/editcats',expressJoi(add_editcats_schema),catsHandler.editCats)

//分类数据回显
router.get('/getonecats',catsHandler.getOnecats)

module.exports = router

