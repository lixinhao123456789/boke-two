
$.ajaxPrefilter(function(options){
    // 使用ajaxPrefilter拦截器 options.url获取你使用时ajax中的url 
    //为简化代码
    options.url = "http://127.0.0.1:3030"+options.url

    //放置token
    if(options.url.indexOf("/auth/") !== -1){
        options.headers = {
            Authorization:localStorage.getItem("token") || ""
        }
    }
    if(options.url.indexOf('/cauth/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem("token") || ""
        }
    }

    //守卫token代码
    options.complete = function(res){
        // if(res.responseJSON.)
        // console.log(res);
        if(res.responseJSON.status == 1 && res.responseJSON.msg == "身份验证失败"){
            //清空token
            localStorage.removeItem('token')
            //重定向登录页面
            location.href='./login.html'
        }
    }
})