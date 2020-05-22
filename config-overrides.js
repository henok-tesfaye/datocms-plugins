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
  },
  {
    entry: 'src/plugins/wiris-studio',
    template: 'public/wiris-studio/index.html',
    outPath: '/wiris-studio/index.html'
  }
])
const { styles } = require('@ckeditor/ckeditor5-dev-utils')
// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const CKEditorCSSRegex = /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/
const svgRegex = /theme[/\\]icons[/\\][^/\\]+\.svg$/

const addExclude = (obj, toBeAdded) => {
  const isExcludeArray = Array.isArray(obj.exclude)
  const newExclude = isExcludeArray ? obj.exclude.concat(toBeAdded)
    : obj.exclude ? [obj.exclude, ...toBeAdded] : [...toBeAdded]
  return { ...obj, exclude: newExclude }
}

const regexEqual = (regex1, regex2) => {
  if (!regex1 || !regex2) return false
  return regex1.source === regex2.source
}

const svgAndCssCKEditorLoaders = [
  {
    test: /theme[/\\]icons[/\\][^/\\]+\.svg$/,
    use: ['raw-loader']
  },
  {
    test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
    use: [
      {
        loader: 'style-loader',
        options: {
          injectType: 'singletonStyleTag',
          attributes: {
            'data-cke': true
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: styles.getPostCssConfig({
          themeImporter: {
            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
          },
          minify: true
        })
      }
    ]
  }
]

module.exports = function override (config, env) {
  config.module.rules = config.module.rules.map(rule => {
    if (!Array.isArray(rule.oneOf)) return rule
    const oneOfRulesLength = rule.oneOf.length
    let oneOfRules = rule.oneOf.map((r, innerIndex) => {
      if (regexEqual(r.test, cssRegex) || regexEqual(r.test, cssModuleRegex)) {
        return addExclude(r, [CKEditorCSSRegex])
      }
      // the last rule is file-loader
      if (oneOfRulesLength === innerIndex + 1) {
        return addExclude(r, [svgRegex, CKEditorCSSRegex])
      }
      return r
    })
    oneOfRules = svgAndCssCKEditorLoaders.concat(oneOfRules)
    return { oneOf: oneOfRules }
  })
  multipleEntry.addMultiEntry(config)
  return config
}
