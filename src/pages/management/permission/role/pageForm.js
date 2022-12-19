import React, { useEffect } from 'react'
import { Form, Input, Modal } from '@arco-design/web-react';

const FormItem = Form.Item;

const PageFrom = ({ visible, onSubmit, close, loading }) => {
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
      console.log(res);
      onSubmit(res)
    });
  }

  useEffect(() => {
    if (visible === false) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      simple
      maskClosable={false}
      title='添加角色'
      visible={visible}
      onOk={() => onOk()}
      onCancel={() => close()}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        labelCol={{ style: { flexBasis: 90 } }}
        wrapperCol={{ style: { flexBasis: 'calc(100% - 90px)' } }}
        onSubmit={() => onOk()}
      >
        <FormItem label='角色名称' field='name' rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input placeholder='请输入角色名称' />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default PageFrom
