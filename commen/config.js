let url_config = ""

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    url_config = 'https://api.elong.com'
}else{
    // 测试环境
    url_config = 'https://api-test.elong.com'
}

export default url_config