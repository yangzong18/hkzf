import React, { Component } from 'react'
// 导入 react-spring 动画库组件
import { Spring } from 'react-spring'

import FilterTitle from '../FilterTitle'

import styles from './index.module.css'
import FilterPicker from '../FilterPicker'
import { request } from '../../../../utils/request'
import FilterMore from '../FilterMore'
// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 展示或隐藏的状态
    openType: '',
    // 所有筛选条件数据
    filtersData: {},
    // 筛选条件的选中值
    selectedValues
  }
  componentDidMount() {
    this.htmlBody = document.body
    this.getFiltersData()
  }
  // 获取筛选条件
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const { data } = await request.get(`/houses/condition?id=${value}`)
    this.setState({
      filtersData: data.body
    })
  }
  // 点击标题菜单实现高亮
  onTitleClick = type => {
    // 给body 添加样式
    this.htmlBody.className = 'body-fixed'
    // 标题选中状态对象和筛选条件的选中值对象
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true
        return
      }
      // 其他标题
      const selectedVal = selectedValues[key]
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  // 取消事件
  onCancel = type => {
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 菜单高亮逻辑处理
    const selectedVal = selectedValues[type]
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState(() => {
      return {
        openType: '',
        // 更新菜单高亮状态数据
        titleSelectedStatus: newTitleSelectedStatus
      }
    })
  }

  // 保存事件
  onSave = (type, value) => {
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    const selectedVal = value
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      // 高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value
    }
    const filters = {}
    const { area, mode, price, more } = newSelectedValues
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    filters[mode] = mode[0]
    filters[price] = price[0]
    filters.more = more.join(',')
    console.log(this.props)
    this.props.onFilter(filters)
    console.log('🚀 ~ file: index.jsx ~ line 152 ~ Filter ~ filters', filters)
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues
    })
  }

  // 遮罩层
  renderMask() {
    const { openType } = this.state
    const isHide = openType === 'more' || openType === ''
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          if (isHide) {
            return null
          }
          return <div style={props} className={styles.mask} onClick={() => this.onCancel(openType)}></div>
        }}
      </Spring>
    )
  }
  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }

    return <FilterPicker key={openType} type={openType} onCancel={this.onCancel} onSave={this.onSave} data={data} cols={cols} defaultValue={defaultValue} />
  }

  renderFilterMore() {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state

    if (openType !== 'more') {
      return null
    }

    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    const defaultValue = selectedValues.more

    return <FilterMore data={data} type={openType} onCancel={this.onCancel} onSave={this.onSave} defaultValue={defaultValue} />
  }
  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {this.renderMask()}
        <div className={styles.content}>
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />
          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
