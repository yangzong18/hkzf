import React, { Component } from 'react'
import './index.scss'

export default class Map extends Component {
  componentDidMount () {
    // 初始化地图实例
    const map = new window.BMapGL.Map('container')
    // 创建地图实例 
    const point = new window.BMapGL.Point(116.404, 39.915);
    // 创建点坐标 
    map.centerAndZoom(point, 15);
  }
  render() {
    return (
      <div className='map'>
        <div id="container" style={{ height: '100%'}}>
        </div>
      </div>
    )
  }
}
