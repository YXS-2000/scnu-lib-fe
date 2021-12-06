import React, { useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Popover,
  Tag,
  Space,
  message,
  Skeleton,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { initList } from '@/reducers/actReducer';
import { cleanUser, initUserList } from '@/reducers/usermReducer';
import { EditOutlined, CommentOutlined } from '@ant-design/icons';
import { initSetting } from '@/reducers/userSettingReducer';
import { getNotifyApi, getSettingApi } from '@/Services/auth';
import { cleanUserInfo, initUserInfo } from '@/reducers/userReducer';
import { getUserID } from '@/Utils/auth';
function User(props: any) {
  const dataSource = useSelector((store: RootState) => store.userList);
  const dispatch = useDispatch();
  const getList = (size: number) => {
    dispatch(cleanUser());
    //本来是page的，后端没有提供page查询，只能前端来实现了
    dispatch(initUserList(size));
  };
  const handleDelete = (txt: any) => {
    console.log(txt);
  };
  useEffect(() => {
    getList(999);
  }, []);
  const columns: object[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: '_id',
      responsive: ['md'],
    },
    {
      title: '学院',
      dataIndex: 'college',
      key: 'college',
      responsive: ['md'],
    },
    {
      title: '用户权限',
      dataIndex: 'role',
      render: (txt: any, record: any, index: any) => {
        switch (txt) {
          case 'ROLE_USER':
            return <Tag color="geekblue">用户</Tag>;
          case 'ROLE_ADMIN':
            return <Tag color="orange">管理员</Tag>;
          case 'ROLE_LIBRARIAN':
            return <Tag color="lime">图书馆管理员</Tag>;
          default:
            return <Tag color="geekblue">用户</Tag>;
        }
      },
    },
    ,
    {
      title: '联系方式',
      dataIndex: 'connection',
      key: 'connnection',
      responsive: ['md'],
    },
    {
      title: '操作',
      render: (txt: any, record: any, index: any) => {
        return (
          <>
            <Space>
              <Popover content={<div>修改用户信息</div>}>
                <EditOutlined
                  onClick={() => {
                    //dispatch(initSetting(record.id));
                    getSettingApi(record.id)
                      .then(res => {
                        dispatch(initSetting(res.data));

                        props.history.push(
                          `/home/adminUser/userdetails/${record.id}`,
                        );
                      })
                      .catch(err => {
                        message.error('Oops!发生了未知的错误');
                      });
                  }}
                />
              </Popover>
              <Popover content={<div>查看用户联系方式</div>}>
                <CommentOutlined
                  onClick={() => {
                    dispatch(cleanUserInfo());
                    getNotifyApi(record.id)
                      .then(res => {
                        console.log(res.data);
                        dispatch(initUserInfo(res.data));
                        props.history.push(
                          `/home/adminUser/usernotices/${record.id}`,
                        );
                      })
                      .catch(err => {
                        message.error('Oops!发生了未知的错误');
                      });
                  }}
                />
              </Popover>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <Card title="用户列表">
      {dataSource.length === 0 ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table columns={columns} dataSource={dataSource} />
      )}
    </Card>
  );
}

export default User;
