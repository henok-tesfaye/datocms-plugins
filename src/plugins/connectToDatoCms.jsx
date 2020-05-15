import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default mapPluginToProps => BaseComponent => (
  class ConnectToDatoCms extends Component {
    static get propTypes () {
      return {
        plugin: PropTypes.any
      }
    }

    constructor (props) {
      super(props)
      this.state = mapPluginToProps(props.plugin)
    }

    componentDidMount () {
      const { plugin } = this.props

      this.unsubscribe = plugin.addFieldChangeListener(plugin.fieldPath, () => {
        this.setState(mapPluginToProps(plugin))
      })
    }

    componentWillUnmount () {
      this.unsubscribe()
    }

    render () {
      return <BaseComponent {...this.props} {...this.state} />
    }
  }
)
