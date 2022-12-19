import React, { useEffect } from 'react'
import { Form, Modal, Select } from '@arco-design/web-react';

const FormItem = Form.Item;
const Option = Select.Option;

const RoleForm = ({ dataSource = [], visible, onSubmit, close, loading, userRole }) => {
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
    }
  }, [visible]);

  useEffect(() => {
    if (userRole) {
      form.setFieldValue('roleId', userRole);
    }
  }, [userRole]);

  return (
    <Modal
      simple
      maskClosable={false}
      title='角色分配'
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
        <FormItem label='用户角色' field='roleId' rules={[{ required: true, message: '请选择用户角色' }]}>
          <Select
            placeholder='请选择用户角色'
          >
            {dataSource.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  )
}

export default RoleForm;
