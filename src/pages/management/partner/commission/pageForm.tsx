import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Modal } from '@arco-design/web-react';
import { RootState } from '@/redux/store';
import {
  getPartnerInfo,
  clearEmail,
} from '@/redux/reducer/partner/commission';

const FormItem = Form.Item;
const InputSearch = Input.Search;

// @ts-ignore
const PageForm = ({ visible, onSubmit, close, loading, type, formData }) => {
  const dispatch = useDispatch();
  const {
    inputLoading,
    inputEmail,
  } = useSelector(
    (state: RootState) => state.partnerCommissionSlice,
  );
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 17,
    },
  };
  const onOk = () => {
    form.validate().then((res) => {
      onSubmit(res)
    });
  }


  const handleBlur = () => {
    const userId = form.getFieldValue('userId');
    if (!userId) return false;
    dispatch(getPartnerInfo({ userId }));
  }

  const onFormChanged = (val: any) => {
    const { userId } = val;
    if (userId) {
      dispatch(clearEmail())
    }
  }

  useEffect(() => {
    if (visible === false) {
      form.resetFields();
      dispatch(clearEmail())
    } else if (formData) {
      const { partnerName, partnerUserId, bonusRate } = formData;
      form.setFieldsValue({
        memberEmail: partnerName,
        rate: bonusRate,
        userId: partnerUserId,
      })
    }
  }, [visible, formData]);

  useEffect(() => {
    console.log(inputEmail);
    
    if (inputEmail && type === 'add') {
      form.setFieldValue('memberEmail', inputEmail)
    }
  }, [inputEmail])

  return (
    <Modal
      simple
      maskClosable={false}
      title={`${type === 'add' ? '添加' : '修改'}合伙人`}
      visible={visible}
      onOk={() => onOk()}
      onCancel={() => close()}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        onSubmit={() => onOk()}
        onChange={onFormChanged}
      >
        <FormItem label='合伙人UID' field='userId' rules={[{ required: true, message: '请输入合伙人UID' }]}>
          <InputSearch loading={inputLoading && (type === 'add')} onBlur={handleBlur} disabled={type === 'update'} placeholder='请输入合伙人UID' />
        </FormItem>
        {
          inputEmail && type === 'add' && (
            <FormItem label='合伙人邮箱' field='memberEmail' rules={[{ required: true, message: '请输入合伙人邮箱' }]}>
            <Input disabled />
          </FormItem>
          )
        }
        <FormItem label='返佣比例' field='rate' rules={[{ required: true, type: 'number', min: 0, max: 100, message: '请输入0-100的返佣比例' }]}>
          <Input placeholder='请输入返佣比例' addAfter='%' />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default PageForm;
