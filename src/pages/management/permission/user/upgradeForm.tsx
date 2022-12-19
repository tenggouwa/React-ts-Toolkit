import React, { useEffect } from 'react'
import { Form, Input, Modal } from '@arco-design/web-react';

const FormItem = Form.Item;

// @ts-ignore
const PageForm = ({ id, visible, onSubmit, close, loading }) => {

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

  useEffect(() => {
    if (visible === false) {
      form.resetFields();
    } else {
      form.setFieldValue('id', id)
    }
  }, [visible]);


  return (
    <Modal
      simple
      maskClosable={false}
      title='角色升级'
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
        onSubmit={() => onOk()}
      >
        <FormItem label='合伙人UID' field='id' rules={[{ required: true, message: '请输入合伙人UID' }]}>
          <Input disabled />
        </FormItem>
        <FormItem label='返佣比例' field='rate' rules={[{ required: true, type: 'number', min: 0, max: 100, message: '请输入0-100的返佣比例' }]}>
          <Input placeholder='请输入返佣比例' addAfter='%' />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default PageForm;
