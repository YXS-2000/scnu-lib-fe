import React, { useEffect } from 'react';
import { Form, Input, Button, message, Cascader } from 'antd';
import { getUserID, isLogined } from '@/Utils/auth';
import { initLoginInUserSetting } from '@/reducers/loginInUserSetting';
import { initUserInfo } from '@/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifyApi, getSettingApi } from '@/Services/auth';
import { collegeList } from '@/Pages/Login/collegeList';
export default function ChangeUserconfig({
  userSetting,
  userInfo,
  layout,
  onFinish,
  tailLayout,
}: any) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogined()) {
      const id = getUserID();
      getSettingApi(id)
        .then(res => {
          dispatch(initLoginInUserSetting(res.data));
        })
        .catch(err => {
          message.error('Oops!发生了未知的错误');
        });
      getNotifyApi(id)
        .then(res => {
          dispatch(initUserInfo(res.data));
        })
        .catch(err => {
          message.error('Oops!发生了未知的错误');
        });
    }
  }, []);
  function filter(inputValue, path) {
    return path.some(
      option =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );
  }
  return (
    <Form name="notify-form" onFinish={onFinish} {...layout}>
      <Form.Item
        name="username"
        label="账号"
        rules={[{ required: true }]}
        initialValue={userSetting?.username}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="name"
        label="昵称"
        initialValue={userSetting?.detail?.name}
        rules={[
          { required: true, message: '请填写昵称' },
          { max: 31, message: '请输入小于32位字符的昵称' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="studentId"
        label="学号"
        initialValue={userSetting?.detail?.studentId}
        rules={[{ required: true, message: '请填写10-11位数字学号' }]}
      >
        <Input maxLength={11} minLength={10} />
      </Form.Item>

      <Form.Item
        name="college"
        label="学院"
        initialValue={
          userSetting?.detail?.college == null
            ? null
            : userSetting?.detail?.college.split('/')
        }
        rules={[
          {
            type: 'array',
            required: true,
            message: '请输入或选择你的学院',
          },
        ]}
      >
        <Cascader
          options={collegeList}
          showSearch={{ filter }}
          placeholder=""
        />
      </Form.Item>

      <Form.Item
        label="微信号"
        name="wechat"
        rules={[{ required: true, message: '请输入你的微信号！' }]}
        initialValue={userInfo?.wechat?.wxid}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="email"
        name="email"
        rules={[
          { required: true, message: '请输入你的邮箱！' },
          {
            type: 'email',
            message: '请输入正确格式的邮箱地址！',
          },
        ]}
        initialValue={userInfo?.email?.address}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}
