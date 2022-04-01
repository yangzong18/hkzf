import { WhiteSpace, WingBlank, Toast, Flex } from 'antd-mobile-v2'
import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
// 导入 withFormik
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import styles from './index.module.css'
import { request } from '../../utils/request'
import { Link } from 'react-router-dom'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/
class Registe extends Component {
  state = {
    username: '',
    password: ''
  }
  render() {
    return (
      <div className={styles.root}>
        <NavHeader className={styles.navHeader}>注册</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field type="text" className={styles.input} name="username" placeholder="请输入账号"></Field>
            </div>
            <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>
            <div className={styles.formItem}>
              <Field type="possword" className={styles.input} name="password" placeholder="请输入密码" />
            </div>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                注册
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome} justify="between">
            <Link to="/home">点我回首页</Link>
            <Link to="/login">已有账号，去登录</Link>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 使用 withFormik 高阶组件包装 Login 组件
// 为 Login 组件提供属性和方法
Registe = withFormik({
  // 提供状态
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 添加表单校验规则
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),

  // 表单的提交事件
  handleSubmit: async (values, { props }) => {
    // console.log(values)
    // 获取账号和密码
    const { username, password } = values
    // 发送请求
    const { data: res } = await request.post('/user/registered', {
      username,
      password
    })

    // console.log('登录结果：', res)
    const { status, body, description } = res

    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)

      if (!props.location.state) {
        // 直接进入到了该页面，调用 go(-1) 返回上一级路由
        props.history.go(-1)
      } else {
        // push：[home, login, map]
        // replace: [home, map]
        // props.history.push(props.location.state.from.pathname)

        // 使用 replace 方法替换 push 方法，这样返回上一页，不会再次跳转到 login 页面
        props.history.replace(props.location.state.from.pathname)
      }
      // props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  }
})(Registe)
export default Registe
