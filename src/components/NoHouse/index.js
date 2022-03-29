import React from 'react'
import styles from './index.module.css'
import PropTypes from 'prop-types'
const NoHouse = ({ children }) => (
  <div className={styles.root}>
    <div className={styles.msg}>{children}</div>
  </div>
)

NoHouse.propTypes = {
  children: PropTypes.node.isRequired
}

export default NoHouse
