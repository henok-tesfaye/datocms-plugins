import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'

import connectToDatoCms from '../connectToDatoCms'
import './style.css'
const ClassicEditor = require('./ckeditor5/build/ckeditor')

class Main extends Component {
  render () {
    const { plugin, fieldValue } = this.props
    return (
      <CKEditor
        editor={ClassicEditor}
        data={fieldValue}
        onInit={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor)
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          plugin.setFieldValue(plugin.fieldPath, data)
        }}
      />
    )
  }
}

const mapPluginToProps = plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath)
})

export default connectToDatoCms(mapPluginToProps)(Main)
