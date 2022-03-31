import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import './index.module.css'
export default class Sticky extends Component {
  placeholder = createRef()
  content = createRef()
  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder}></div>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired
}
