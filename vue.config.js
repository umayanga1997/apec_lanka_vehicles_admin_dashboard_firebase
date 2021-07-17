module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    devServer: {
        proxy: 'https://firebasestorage.googleapis.com/'
    }
}