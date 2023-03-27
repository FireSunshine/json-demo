import { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Space } from 'antd';
import axios from 'axios';
import UserForm from './UserForm';

const UsersList = () => {
  const [users, setUsers] = useState<User.IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<User.IRecord>({});
  const [type, setType] = useState<string>('add');
  const userFormRef = useRef<User.IUserFormRef>();
  const [pageInfo, setPageInfo] = useState<User.IPageInfo>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  const BaseUrl = 'http://127.0.0.1:5173';

  const fetchUsers = async () => {
    setLoading(true);
    const response = await axios.get(`${BaseUrl}/api/users?_page=${pageInfo.pageNum}&_limit=${pageInfo.pageSize}`);
    setUsers(response.data);
    setPageInfo({ ...pageInfo, total: Number(response.headers['x-total-count']) });
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [pageInfo.pageNum, pageInfo.pageSize]);

  const handle = async () => {
    let res;
    switch (type) {
      case 'add':
      case 'edit':
        const form = userFormRef.current?.form;
        const formData = await form.validateFields();
        setLoading(true);
        if (type === 'edit' && 'id' in record) {
          res = await axios.put(`${BaseUrl}/api/users/${record.id}`, formData);
        } else {
          res = await axios.post(`${BaseUrl}/api/users`, formData);
        }
        if (res.status === 200 || res.status === 201) {
          fetchUsers();
          setVisible(false);
          setLoading(false);
        }
        break;
      case 'delete':
        if ('id' in record) {
          setLoading(true);
          res = await axios.delete(`${BaseUrl}/api/users/${record.id}`);
          if (res.status === 200 || res.status === 201) {
            if (pageInfo.pageNum !== 1 && users.length === 1) {
              setPageInfo({ ...pageInfo, pageNum: pageInfo.pageNum - 1 });
            } else {
              fetchUsers();
            }
            setVisible(false);
            setLoading(false);
          }
        }
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: (
        <Space size={12}>
          Action
          <Button
            danger
            loading={loading}
            onClick={() => {
              setType('add');
              setVisible(true);
            }}
          >
            Add
          </Button>
        </Space>
      ),
      dataIndex: '',
      key: 'action',
      width: '300px',
      render: (_: string, record: User.IUser) => (
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              setType('edit');
              setRecord(record);
              setVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            loading={loading}
            onClick={() => {
              setType('delete');
              setRecord(record);
              setVisible(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: pageInfo.pageNum,
          pageSize: pageInfo.pageSize,
          total: pageInfo.total,
          onChange: (pageNum, pageSize) => {
            setPageInfo({ ...pageInfo, pageNum, pageSize });
          },
        }}
      />
      {visible && (
        <Modal
          title={(type === 'add' ? 'Add' : type === 'edit' ? 'Edit' : 'Delete') + ' User'}
          open={visible}
          onCancel={() => setVisible(false)}
          onOk={handle}
          confirmLoading={loading}
        >
          {type === 'delete' ? (
            'Are you sure you want to delete this user?'
          ) : (
            <UserForm type={type} record={record} ref={userFormRef} />
          )}
        </Modal>
      )}
    </>
  );
};

export default UsersList;
