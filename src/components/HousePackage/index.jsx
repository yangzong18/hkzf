import React, { Component } from 'react'
import styles from './index.module.css'

// 所有房屋配置项
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: '衣柜',
    icon: 'icon-wardrobe'
  },
  {
    id: 2,
    name: '洗衣机',
    icon: 'icon-wash'
  },
  {
    id: 3,
    name: '空调',
    icon: 'icon-air'
  },
  {
    id: 4,
    name: '天然气',
    icon: 'icon-gas'
  },
  {
    id: 5,
    name: '冰箱',
    icon: 'icon-ref'
  },
  {
    id: 6,
    name: '暖气',
    icon: 'icon-Heat'
  },
  {
    id: 7,
    name: '电视',
    icon: 'icon-vid'
  },
  {
    id: 8,
    name: '热水器',
    icon: 'icon-heater'
  },
  {
    id: 9,
    name: '宽带',
    icon: 'icon-broadband'
  },
  {
    id: 10,
    name: '沙发',
    icon: 'icon-sofa'
  }
]
/* 
  该组件的两种功能：
  1 根据传入的 list 展示房屋配置列表（房源详情页面）
    <HousePackage list={['衣柜', '洗衣机']} />
  2 从所有配置列表中选择房屋配置（发布房源页面）
    <HousePackage select onSelect={selectedItems => {...}} />
*/
export default class HousePackage extends Component {
  state = {
    selectedNames: []
  }
  toggleSelect = name => {
    const { selectedNames } = this.state
    let newSelectNames
    if (selectedNames.indexOf(name) > -1) {
      newSelectNames = selectedNames.filter(item => item !== name)
    } else {
      newSelectNames = [...selectedNames, name]
    }
    this.props.onSelect(newSelectNames)
    this.setState({
      selectedNames: newSelectNames
    })
  }
  // 渲染列表项
  renderItems() {
    const { selectedNames } = this.state
    const { select, list } = this.props
    let data
    if (select) {
      data = selectedNames
    } else {
      data = HOUSE_PACKAGE.filter(v => list.includes(v.name))
    }

    return data.map(item => {
      const isSelected = selectedNames.indexOf(item.name) > -1
      return (
        <li key={item.id} className={[styles.item, isSelected ? styles.active : ''].join(' ')} onClick={select && (() => this.toggleSelect(item.name))}>
          <p>
            <i className={`iconfont ${item.icon} ${styles.icon}`}></i>
          </p>
          {item.name}
        </li>
      )
    })
  }
  render() {
    return <ul className={styles.root}>{this.renderItems()}</ul>
  }
}

// 属性默认值，防止在使用该组件时，不传 onSelect 报错
HousePackage.defaultProps = {
  onSelect: () => {}
}
