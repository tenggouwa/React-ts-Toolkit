import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Modal, Select } from '@arco-design/web-react';
import { RootState } from '@/redux/store';
import {
  getMemberInfo,
  clearEmail,
} from '@/redux/reducer/permission/user';

const InputSearch = Input.Search;
const FormItem = Form.Item;

// @ts-ignore
const PageForm = ({ visible, onSubmit, close, loading }) => {
  const dispatch = useDispatch();
  const {
    inputLoading,
    inputEmail,
  } = useSelector(
    (state: RootState) => state.permissionUserSlice,
  );

  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  const onOk = () => {
    form.validate().then((res) => {
      onSubmit(res)
    });
  }

  const handleBlur = () => {
    const userId = form.getFieldValue('brokerId');
    if (!userId) return false;
    dispatch(getMemberInfo({ userId }));
  }

  const onFormChanged = (val: any) => {
    const { brokerId } = val;
    if (brokerId) {
      dispatch(clearEmail())
    }
  }

  useEffect(() => {
    if (visible === false) {
      form.resetFields();
      dispatch(clearEmail())
    }
  }, [visible]);

  useEffect(() => {
    if (inputEmail) {
      form.setFieldValue('email', inputEmail)
    }
  }, [inputEmail])

  return (
    <Modal
      simple
      maskClosable={false}
      title='添加用户'
      visible={visible}
      onOk={() => onOk()}
      onCancel={() => close()}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        labelCol={{ style: { flexBasis: 110 } }}
        wrapperCol={{ style: { flexBasis: 'calc(100% - 110px)' } }}
        onChange={onFormChanged}
        onSubmit={() => onOk()}
      >
        <FormItem label='平台用户ID' field='brokerId' rules={[{ required: true, message: '请输入平台用户ID' }]}>
          <InputSearch loading={inputLoading} onBlur={handleBlur} placeholder='请输入平台用户ID' />
        </FormItem>
        {
          inputEmail && <FormItem label='邮箱' field='email' rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input disabled placeholder='请输入邮箱' />
          </FormItem>
        }
        {/* <FormItem label='用户名' field='username' rules={[{ required: true, message: '请输入用户名' }]}>
          <Input disabled placeholder='请输入用户名' />
        </FormItem> */}
      </Form>
    </Modal>
  )
}

export default PageForm;
