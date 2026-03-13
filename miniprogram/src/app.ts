import { Component } from 'react'
import Taro from '@tarojs/taro'
import CloudUtil from './utils/cloud'
import './app.scss'

class App extends Component {
  componentDidMount () {
    // 初始化云开发环境
    CloudUtil.init()
  }

  componentDidShow () {}

  componentDidHide () {}

  render () {
    return this.props.children
  }
}

export default App
