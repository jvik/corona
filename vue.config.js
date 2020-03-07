module.exports = {
	transpileDependencies: ["vuetify"],
	pwa: {
    name: 'Corona',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',

   // configure the manifest options
   manifestOptions: {
     display: 'portrait',
     background_color: "#42B883"
     // ...
   },

    // configure the workbox plugin
    // workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/registerServiceWorker.js',
      // ...other Workbox options...
    }
  }
};
