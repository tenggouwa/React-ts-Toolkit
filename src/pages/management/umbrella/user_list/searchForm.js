import React from 'react'
import { Form, Input, Button } from '@arco-design/web-react';

const FormItem = Form.Item;

const SearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validate().then((res) => {
      onSearch(res)
    });
  }

  const handleReset = () => {
    form.resetFields();
    onSearch({})
  };

  return (
    <Form
      style={{ width: '100%' }}
      form={form}
      layout="inline"
      className="searchForm"
      onOk={() => onOk()}
      onCancel={() => close()}
    >
      <FormItem label='邮箱' field='searchAccount'>
        <Input style={{ width: 270 }} placeholder='请输入用户邮箱' />
      </FormItem>
      <FormItem >
        <Button type='primary' htmlType='submit' style={{ marginRight: '24px' }} onClick={() => onOk()}>搜索</Button>
        <Button onClick={() => handleReset()}> 重置 </Button>
      </FormItem>
    </Form>
  )
}


export default SearchForm;
