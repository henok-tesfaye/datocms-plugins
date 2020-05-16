const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/plugins/ckeditor-mathtype',
    // HTML template used in plugin HtmlWebpackPlugin
    template: 'public/ckeditor-mathtype/index.html',
    // The file to write the HTML to. You can specify a subdirectory
    outPath: '/ckeditor-mathtype/index.html'
    // Visit: http[s]://localhost:3000/ckeditor-mathtype/index.html
  },
  {
    entry: 'src/plugins/desmos',
    template: 'public/desmos/index.html',
    outPath: '/desmos/index.html'
  }
])

module.exports = function override (config, env) {
  multipleEntry.addMultiEntry(config)
  return config
}
