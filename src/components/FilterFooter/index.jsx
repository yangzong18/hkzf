import { Flex } from 'antd-mobile-v2'
import React from 'react'
import styles from './index.module.css'
import PropTypes from 'prop-types'
function FilterFooter({ cancelText = '取消', okText = '确定', onCancel, onOk, className }) {
  return (
    <Flex className={[styles.root, className || ''].join(' ')}>
      <span className={[styles.btn, styles.cancel].join(' ')} onClick={onCancel}>
        {cancelText}
      </span>
      <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
        {okText}
      </span>
    </Flex>
  )
}

// props 校验
FilterFooter.propTypes = {
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
}

export default FilterFooter
