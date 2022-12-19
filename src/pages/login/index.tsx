import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Form, Input, Button, Typography } from '@arco-design/web-react';

import { RootState } from '@/redux/store';
import { getMenuInfo } from '@/redux/reducer';
import { loginSubmit, LoginFormIn, clearStore } from '@/redux/reducer/login';

import './index.scss';

const FormItem = Form.Item;

const LoginTitle = () => {
  return (
    <Typography
      style={{
        width: 400,
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <Typography.Title heading={3}>
        Welcome to
      </Typography.Title>
      <Typography.Title heading={2}>
        BACKSTAGE
      </Typography.Title>
      <Typography.Title heading={6}>
        欢迎来到合伙人管理系统
      </Typography.Title>
    </Typography>
  )
}

interface LoginFormProps {
  submit: (v:LoginFormIn) => any,
  loading: boolean
}

const LoginForm = ({ submit, loading }: LoginFormProps) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      style={{
        width: 400,
        margin: '30px auto'
      }}
      layout="vertical"
      onSubmit={(v) => {
        submit(v)
      }}
    >
      <FormItem
        label='用户名'
        field='username'
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder='请输入用户名' />
      </FormItem>
      <FormItem
        label='密码'
        field='password'
        rules={[{ required: true, message: '请输入密码'}]}
      >
        <Input.Password placeholder='请输入密码' />
      </FormItem>
      <FormItem>
        <Button type='primary' htmlType='submit' long loading={loading}>
          登录
        </Button>
      </FormItem>
    </Form>
  )
}

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, isLoginSuccess } = useSelector(
    (state: RootState) => state.loginSlice,
  );

  // const { menuInfo } = useSelector(
  //   (state: RootState) => state.appSlice,
  // );
  
  useEffect(() => {
    return function cleanup() {
      dispatch(clearStore())
    };
  }, []);

  useEffect(() => {
    if (isLoginSuccess) {
      dispatch(getMenuInfo());
      setTimeout(() => {
        history.push('/')
      }, 500)
    }
  }, [isLoginSuccess]);

  const submit = (values: LoginFormIn) => {
    dispatch(loginSubmit(values));
  }

  return (
    <div className='login'>
      <LoginTitle />
      <LoginForm submit={(values: LoginFormIn) => submit(values)} loading={loading} />
    </div>
  )
}

export default Login;
