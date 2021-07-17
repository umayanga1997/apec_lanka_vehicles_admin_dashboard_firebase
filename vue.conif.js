module.exports = {
    configureWebpack: {
        devServer: {
            port: 8080,
            proxy: {
                '/': {
                    target: 'https://firebasestorage.googleapis.com/',
                }
            }
        }
    }
}