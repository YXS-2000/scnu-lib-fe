import React, { useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Popconfirm,
  Space,
  Popover,
  Skeleton,
} from 'antd';
import { RootState } from '@/store';
import {
  UserSwitchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { initList } from '@/reducers/actReducer';
import { initActDetail } from '@/reducers/actDetailReducer';
import { detailApi, userVolSignUpApi } from '@/Services/activity';
// 活动列表

function ListAct(props: any) {
  const dataSource = useSelector((store: RootState) => store.act);
  //const currentParticipant = useSelector((store: RootState) => store.actParticipants);
  const dispatch = useDispatch();
  const getAct = (page: number = 0) => {
    dispatch(initList('all', page, 20));
  };
  useEffect(() => {
    getAct();
  }, []);

  const columns: object[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: '_id',
      responsive: ['md'],
    },
    {
      title: '活动标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '报名截止时间',
      key: 'signUpDeadline',
      responsive: ['md'],
      render: (txt: any, record: any, index: any) => {
        return txt.signUpDeadline
          .slice(5, 16)
          .replace('-', '.')
          .replace('T', ' ');
      },
    },
    {
      title: '活动时间',
      key: 'startendTime',

      render: (txt: any, record: any, index: any) => {
        return (
          txt.startTime
            .slice(5, 16)
            .replace('-', '.')
            .replace('T', ' ') +
          '~' +
          txt.endTime
            .slice(5, 16)
            .replace('-', '.')
            .replace('T', ' ')
        );
      },
    },
    {
      title: '报名人数',
      key: 'Participant',
      responsive: ['md'],

      render: (txt: any, record: any, index: any) => {
        return txt.currentParticipant + '/' + txt.maxParticipant;
      },
    },
    {
      title: '操作',
      key: '',
      fix: 'right',

      render: (txt: any, record: any, index: any) => {
        return (
          <>
            <Space>
              <Popover content={<div>查看用户列表</div>}>
                <UserSwitchOutlined
                  onClick={() => {
                    props.history.push(
                      `/home/adminAct/actParticipants/${txt.id}`,
                    );
                  }}
                />
              </Popover>
              <Popover content={<div>编辑该活动</div>}>
                <EditOutlined
                  onClick={() => {
                    dispatch(initActDetail(txt.id));
                    detailApi(txt.id)
                      .then(res => {
                        dispatch(initActDetail(res.data));
                      })
                      .then(res => {
                        props.history.push(
                          `/home/adminAct/createact/${txt.id}`,
                        );
                      });
                  }}
                />
              </Popover>
              <Popconfirm
                title="确定删除此项？"
                onCancel={() => console.log('用户取消删除')}
                onConfirm={
                  () => console.log('用户确认删除') // 此处调用api接口进行操作
                }
              >
                <DeleteOutlined
                  onClick={() => {
                    console.log('delete');
                  }}
                />
              </Popconfirm>
            </Space>
          </>
        );
      },
    },
  ];
  return (
    <Card
      style={{ margin: '0px 10px 0px 10px' }}
      title="活动列表"
      extra={
        <Button
          type="primary"
          onClick={() => props.history.push('/home/adminAct/createact')}
        >
          新增
        </Button>
      }
    >
      {/* {<Table columns={columns} dataSource={dataSource} size="middle" />} */}
      {dataSource.length === 0 ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table columns={columns} dataSource={dataSource} />
      )}
    </Card>
  );
}

export default ListAct;
