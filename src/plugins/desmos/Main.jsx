import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Desmos from './Desmos'
import connectToDatoCms from '../connectToDatoCms'
import './main.css'

class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
      desmosURL: '',
      desmosInstance: null
    }

    this.renderDesmos = this.renderDesmos.bind(this)
    this.handleImportDesmos = this.handleImportDesmos.bind(this)
    this.handleUpdateDesmos = this.handleUpdateDesmos.bind(this)
  }

  componentDidMount () {
    this.renderDesmos()
  }

  renderDesmos () {
    const { plugin } = this.props
    const initialGraph = JSON.parse(
      plugin.getFieldValue(plugin.fieldPath) || '{}'
    )

    const calculator = Desmos.getDesmosInstance()
    calculator.setState(initialGraph.state)
    this.setState({ desmosInstance: calculator })
  }

  handleImportDesmos () {
    const { desmosURL, desmosInstance } = this.state
    const { plugin, setPluginFieldValue } = this.props

    if (!desmosURL) return plugin.alert('Please Input Desmos Graph Url')

    // https://www.desmos.com/calculator/zwul0vwq80
    axios.get(desmosURL).then((response) => {
      this.setState({ desmosURL: '' })
      desmosInstance.setState(response.data.state)
      setPluginFieldValue({
        state: desmosInstance.getState(),
        settings: desmosInstance.settings
      })

      plugin.notice('Desmos Graph Imported')
    }).catch(err => {
      plugin.alert(err.message)
      this.setState({ desmosURL: '' })
    })
  }

  handleUpdateDesmos () {
    const { desmosInstance } = this.state
    const { setPluginFieldValue, plugin } = this.props

    setPluginFieldValue({
      state: desmosInstance.getState(),
      settings: desmosInstance.settings
    })

    plugin.notice('Desmos Graph Updated')
  }

  render () {
    return (
      <div className='container'>
        <input
          type='text'
          name='desmosURL'
          value={this.state.desmosURL}
          placeholder='Paste Desmos Url'
          onChange={(ev) =>
            this.setState({ [ev.target.name]: ev.target.value })}
        />
        <button className='desmos-btn' onClick={this.handleImportDesmos}>
          Import Desmos
        </button>
        <div id='desmos-calculator' style={{ height: '500px' }} />
        <button className='desmos-btn' onClick={this.handleUpdateDesmos}>
          Update Desmos
        </button>
      </div>
    )
  }
}

Main.propTypes = {
  fieldValue: PropTypes.string
}

const mapPluginToProps = plugin => ({
  developmentMode: plugin.parameters.global.developmentMode,
  fieldValue: plugin.getFieldValue(plugin.fieldPath)
})

export default connectToDatoCms(mapPluginToProps)(Main)
