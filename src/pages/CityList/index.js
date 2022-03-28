import React, { Component } from 'react'
import axios from 'axios'
import { Toast } from 'antd-mobile-v2'
import { getCurrentCity } from '../../utils'
import { AutoSizer, List } from 'react-virtualized'
import './index.scss'
import NavHeader from '../../components/NavHeader'

const formatCityData = list => {
  const cityList = {}
  list.forEach(item => {
    const first = item.short.substr(0, 1)
    if (cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item]
    }
  })
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

const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
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
  constructor(props) {
    super(props)

    this.state = {
      cityList: {},
      cityIndex: [],
      // 指定右侧字母索引列表高亮的索引号
      activeIndex: 0
    }

    // 创建ref对象
    this.cityListComponent = React.createRef()
  }
  state = {
    cityList: {},
    cityIndex: [],
    // 指定右侧字母索引列表高亮的索引号
    activeIndex: 0
  }
  async componentDidMount() {
    await this.getCityList()
    // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
    // 注意：调用这个方法的时候，需要保证 List 组件中已经有数据了！如果 List 组件中的数据为空，就会导致调用方法报错！
    // 解决：只要保证这个方法是在 获取到数据之后 调用的即可。
    this.cityListComponent.current.measureAllRows()
  }

  async getCityList() {
    const res = await axios.get('http://127.0.0.1:8080/area/city?level=1')
    const { cityList, cityIndex } = formatCityData(res.data.body)

    // 获取热门城市
    const hotRes = await axios.get('http://127.0.0.1:8080/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')
    const curCity = await getCurrentCity()
    cityList['#'] = curCity
    this.setState((state, props) => {
      return {
        cityList: cityList,
        cityIndex: cityIndex
      }
    })
  }

  changeCity = ({ label, value }) => {
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源数据', 1, null, false)
    }
  }

  // 渲染每一行数据的渲染函数
  // 函数的返回值就表示最终渲染在页面中的内容
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在 List 中是可见的
    style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
  }) => {
    const { cityList, cityIndex } = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map(item => (
          <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  // 用于获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    // console.log('startIndex：', startIndex)
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          // console.log('当前索引号：', index)
          this.cityListComponent.current.scrollToRow(index)
        }}
      >
        <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
      </li>
    ))
  }
  render() {
    return (
      <div className="citylist">
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        <AutoSizer>{({ width, height }) => <List ref={this.cityListComponent} width={width} height={height} rowCount={this.state.cityIndex.length} rowHeight={this.getRowHeight} rowRenderer={this.rowRenderer} onRowsRendered={this.onRowsRendered} scrollToAlignment="start" />}</AutoSizer>
        {/* 索引展示 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}
