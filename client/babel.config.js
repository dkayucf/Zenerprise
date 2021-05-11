module.exports = api => {
    const isTest = api.env('test')
  
    if (isTest) {
      return {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-transform-runtime']
      }
    } else {
      return {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
          '@babel/plugin-transform-runtime',
          [
            'babel-plugin-import',
            {
              libraryName: '@material-ui/core',
              libraryDirectory: 'esm',
              camel2DashComponentName: false
            },
            'core'
          ],
          [
            'babel-plugin-import',
            {
              libraryName: '@material-ui/icons',
              libraryDirectory: 'esm',
              camel2DashComponentName: false
            },
            'icons'
          ]
        ]
      }
    }
  }