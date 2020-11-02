module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/simon/'
    : '/',
    configureWebpack: {
        devtool: 'cheap-module-eval-source-map'
      }
   
}