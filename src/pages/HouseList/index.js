import React from 'react'
import { Flex, Toast } from 'antd-mobile-v2'

import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import NoHouse from '../../components/NoHouse'
import { getCurrentCity } from '../../utils/index'

// 导入组件
import HouseItem from '../../components/HouseItem'
import SearchHeader from '../../components/SearchHeader'
import Sticky from '../../components/Sticky'
import Filter from './components/Filter'

import { request } from '../../utils/request'
import { BASE_URL } from '../../utils/url'
// 导入样式
import styles from './index.module.css'
export default class HouseList extends React.Component {
  state = {
    list: [],
    count: 0,
    isLoading: false,
    label: '',
    value: ''
  }
  // 初始化实例属性
  filters = {}
  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.setState({
      label,
      value
    })
    this.searchList()
  }
  onFilter = filters => {
    window.scrollTo(0, 0)
    this.filters = filters
    this.searchList()
  }
  async searchList() {
    // 获取当前定位城市id
    this.setState({
      isLoading: true
    })
    Toast.loading('加载中...', 0, null, false)
    const { data: res } = await request.get('/houses', {
      params: {
        cityId: this.state.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    const { list, count } = res.body

    // 关闭 loading
    Toast.hide()
    // 提示房源数量
    if (count !== 0) {
      Toast.info(`共找到${count}套房源`, 2, null, false)
    }

    // 将获取到的房屋数据，存储到 state 中
    this.setState({
      list,
      count,
      // 数据加载完成的状态
      isLoading: false
    })
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 用来获取更多房屋列表数据
  // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，
  //      来调用 resolve 让Promise对象的状态变为已完成。
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      request
        .get('/houses', {
          params: {
            cityId: this.state.value,
            ...this.filters,
            start: startIndex,
            end: stopIndex
          }
        })
        .then(res => {
          // console.log('loadMoreRows：', res)
          this.setState({
            list: [...this.state.list, ...res.data.body.list]
          })

          // 数据加载完成时，调用 resolve 即可
          resolve()
        })
    })
  }

  renderHouseList = ({ key, index, style }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]

    // 判断 house 是否存在
    // 如果不存在，就渲染 loading 元素占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    return <HouseItem onClick={() => this.props.history.push(`/detail/${house.houseCode}`)} key={key} style={style} src={BASE_URL + house.houseImg} title={house.title} desc={house.desc} tags={house.tags} price={house.price} />
  }

  // 房子列表的渲染
  renderList() {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }

    return (
      <InfiniteLoader isRowLoaded={this.isRowLoaded} loadMoreRows={this.loadMoreRows} rowCount={count}>
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                    width={width} // 视口的宽度
                    height={height} // 视口的高度
                    rowCount={count} // List列表项的行数
                    rowHeight={120} // 每一行的高度
                    rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  render() {
    return (
      <div className="house-list">
        {/* 顶部展示 */}
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
          <SearchHeader className={styles.searchHeader} cityName={this.state.label}></SearchHeader>
        </Flex>
        {/* 条件筛选栏 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>
        <div className={styles.houseItems}>{this.renderList()}</div>
      </div>
    )
  }
}
