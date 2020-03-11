module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    appleMobileWebAppCapable: 'yes',
    workboxOptions: {
      skipWaiting: true,
    },
  },
}
