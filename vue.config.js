module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    lintOnSave: process.env.NODE_ENV !== 'production',
    devServer: {
        port: 8080,
        proxy: 'https://firebasestorage.googleapis.com/',
        overlay: {
            warnings: true,
            errors: true
        },
    },

    pluginOptions: {
        electronBuilder: {
            chainWebpackRendererProcess(config) {
                config.plugins.delete('workbox')
                config.plugins.delete('pwa')
            },
            nodeIntegration: true
        }
    }
}