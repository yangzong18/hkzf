import React, { PureComponent } from 'react'
import { ActivityIndicator } from 'antd-mobile-v2'

export default class Loading extends PureComponent {
  static defaultProps = {
    show: true
  }
  render() {
    return (
      <div
        style={{
          display: 'block',
          transform: ' translate(-50%,-50%)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 400
        }}
      >
        <ActivityIndicator size="large" />
      </div>
    )
  }
}
