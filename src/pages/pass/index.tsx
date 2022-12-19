import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Form, Input, Button, Typography } from '@arco-design/web-react';

import { RootState } from '@/redux/store';
import {
  userChangePass,
  ChangedFormIn,
  clearStore
} from '@/redux/reducer/login';

import './index.scss';

const FormItem = Form.Item;

const PassTitle = () => {
  return (
    <Typography
      style={{
        width: 400,
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <Typography.Title heading={6}>
        请修改你的密码
      </Typography.Title>
    </Typography>
  )
}

interface PassFormProps {
  submit: (v:ChangedFormIn) => any,
  loading: boolean
}

const PassForm = ({ submit, loading }: PassFormProps) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      style={{
        width: 500,
        margin: '30px auto'
      }}
      layout="vertical"
      onSubmit={(v) => {
        submit(v)
      }}
    >
      <FormItem
        label='密码'
        field='password'
        rules={[{ required: true, message: '请输入密码'}]}
      >
        <Input.Password placeholder='请输入密码' />
      </FormItem>
      <FormItem>
        <Button type='primary' htmlType='submit' long loading={loading}>
          修改密码
        </Button>
      </FormItem>
    </Form>
  )
}

const Pass = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { 
    changedLoading,
    isLoginChangedSuccess
  } = useSelector(
    (state: RootState) => state.loginSlice,
  );
  
  useEffect(() => {
    return function cleanup() {
      dispatch(clearStore())
    };
  }, []);

  useEffect(() => {
    if (isLoginChangedSuccess) {
      history.push('/user')
    }
  }, [isLoginChangedSuccess]);

  const submit = ({ password }: ChangedFormIn) => {
    dispatch(userChangePass(password));
  }

  return (
    <div className='pass'>
      <PassTitle />
      <PassForm submit={submit} loading={changedLoading} />
    </div>
  )
}

export default Pass;
