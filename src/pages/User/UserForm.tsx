import React, { useImperativeHandle, forwardRef } from 'react';
import { Form, Input } from 'antd';
import { useEffect } from 'react';

const UserForm: React.FC<User.IUserForm> = forwardRef((props, ref) => {
  const { type, record } = props;
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    form,
  }));

  useEffect(() => {
    if (type === 'edit') {
      form.setFieldsValue(record);
    }
  }, [record]);

  return (
    <Form form={form} style={{ padding: '20px' }} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label="Age"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
});

export default UserForm;
