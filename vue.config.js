module.exports = {
    devServer: {
        proxy: {
            '/cors': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'http://localhost:8080',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite:{
                    "/cors":''
                }
            }
        }
    },
    css: {
        extract: false
    }、
}