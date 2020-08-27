let express = require("express")
let router = express.Router();
//导入controller-handler
let userinfoHander = require("../controller-handler/userinfo")
// 导入数据校验的中间件
let expressJoi = require("@escook/express-joi")
//导入数据校验规则对象
let { updata_userinfo_schema, updata_password_schema, updata_avatar_schema } = require("../schema/user")

router.get("/userinfo",userinfoHander.getUserInfo)
router.post("/userinfo",expressJoi(updata_userinfo_schema),userinfoHander.updateUserInfo)


//修改密码
router.post("/updatepwd",expressJoi(updata_password_schema),userinfoHander.updatePassword)
//修改用户头像
router.post("/updateAvatar",expressJoi(updata_avatar_schema),userinfoHander.updateAvatar)

module.exports = router