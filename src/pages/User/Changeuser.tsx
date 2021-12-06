import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import './User.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeLoginInUserInfo,
  initLoginInUserInfo,
} from '@/reducers/loginInUserInfoReducer';
import { changeSettingApi, getNotifyApi, getSettingApi } from '@/Services/auth';
import { history } from '@/.umi/core/history';
import ChangeAvatar from './components/ChangeAvatar';
import ChangeUserconfig from './components/ChangeUserconfig';
import ChangeUserLoginConfig from './components/ChangeUserLoginConfig';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};
const { Title } = Typography;
const ChangeUser = (props: any) => {
  const userInfo = useSelector(state => state.loginInUser);
  const userSetting = useSelector(state => state.loginInUserSetting);
  const dispatch = useDispatch();
  const changeNotify = (values: object) => {
    dispatch(changeLoginInUserInfo(values.wechat, values.email));
  };
  const changeUserSetting = (newSetting: object) => {
    // 修改用户信息
    const handlyNewSetting = {
      detail: {},
      //处理表单传来的数据
    };

    console.log(newSetting);
    Object.keys(newSetting).forEach(set => {
      //表单修改数据后value会从数组变成字符串，直接在这边根据是数组还是字符串重新组织对象
      console.log(newSetting[set]);
      if (set !== 'password' && set !== 'email' && set !== 'wechat') {
        //password不理，在后面处理
        if (set === 'name' || set === 'college' || set === 'studentId') {
          //name在后端的属性不一样，独立拿出来处理。
          handlyNewSetting.detail[set] = newSetting[set];
        } else {
          handlyNewSetting[set] = newSetting[set];
        }
      }
      console.log(handlyNewSetting);
    });

    if (newSetting.password === undefined) {
      //判断是否改了密码，不改传空改了传值
      handlyNewSetting.newPassword = '';
      handlyNewSetting.currentPassword = '';
    } else {
      handlyNewSetting.newPassword = newSetting.password;
      handlyNewSetting.currentPassword = newSetting.currentPassword;
    }
    console.log(handlyNewSetting);
    changeSettingApi(newSetting.id, handlyNewSetting)
      .then(res => {
        message.success('保存成功');
        setTimeout(() => history.push('/'), 1000);
      })
      .catch(err => {
        if (err.response.title === 'Incorrect password') {
          message.error('旧密码输入错误，请重新输入');
        } else if (err.response?.status === 500) {
          message.error('该学号已被注册，换一个试试?');
        } else {
          message.error('Oops!发生了未知的错误');
        }
      });
  };
  const onFinish = (values: object) => {
    const processDefaultValues = { ...userSetting, ...userSetting.detail };
    delete processDefaultValues.detail;
    values = Object.assign(processDefaultValues, values);
    values.college = values.college.join('/');
    changeNotify(values);
    changeUserSetting(values); //把新的value覆盖到原有的设置上，可以不用一定要填某个值
    //message.success('保存成功！');
  }; //把后端通信整合到actioncreator中返回的函数
  console.log(userSetting);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Card
        style={{ margin: '20px 0', minWidth: '300px' }}
        title={<Title level={5}>修改个人信息</Title>}
      >
        <ChangeUserconfig
          userSetting={userSetting}
          userInfo={userInfo}
          layout={layout}
          onFinish={onFinish}
          tailLayout={tailLayout}
        />
      </Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Card
          bodyStyle={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}
          style={{ margin: '20px 0', width: '300px' }}
          title={<Title level={5}>上传/修改头像</Title>}
        >
          <div style={{ padding: '40px 0' }}>
            <ChangeAvatar id={userSetting?.id} />
          </div>
        </Card>
        <Card
          style={{ margin: '20px 0', width: '800px', minWidth: '300px' }}
          title={<Title level={5}>修改密码</Title>}
        >
          <ChangeUserLoginConfig
            userSetting={userSetting}
            userInfo={userInfo}
            layout={layout}
            onFinish={onFinish}
            tailLayout={tailLayout}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChangeUser;
