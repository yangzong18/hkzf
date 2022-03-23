import React, { Component } from 'react'
import axios from 'axios'
import { NavBar } from 'antd-mobile-v2'
import { getCurrentCity } from '../../utils'
import {AutoSizer ,List} from 'react-virtualized'
import './index.scss'

const formatCityData = list => {
  const cityList = {}
  list.forEach(item => {
    const first = item.short.substr(0, 1)
    if (cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item]
    }
  });
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50
// 封装处理字母索引的方法
const formatCityIndex = index => {
  switch (index) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return index.toUpperCase()
  }
}

export default class CityList extends Component {
  state = {
    cityList: {},
    cityIndex: []
  }
  componentDidMount () {
    this.getCityList()
  }

  async getCityList () {
    const res = await axios.get('http://127.0.0.1:8080/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(res.data.body)

    // 获取热门城市
    const hotRes = await axios.get('http://127.0.0.1:8080/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')
    const curCity = await getCurrentCity()
    cityList['#'] = curCity;
    console.log(cityList, cityIndex, curCity);
    this.setState((state, props) => {
      return {
        cityList: cityList,
        cityIndex: cityIndex
      }
    })
  }

  // 渲染每一行数据的渲染函数
  // 函数的返回值就表示最终渲染在页面中的内容
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在 List 中是可见的
    style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
  }) =>{

    const { cityList, cityIndex } = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map(item => (
            <div className="name" key={item.value}>
              {item.label}
            </div>
          ))}
      </div>
    )
  }

  getRowHeight = ({index}) => {
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  render() {
    return (
      <div className='citylist'>
        <NavBar
          className='navbar'
          mode="light"
          icon={<i className='iconfont icon-back'></i>}
          onLeftClick={() => this.props.history.go(-1)}
        >城市选择</NavBar>
        {/* 城市列表 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}
