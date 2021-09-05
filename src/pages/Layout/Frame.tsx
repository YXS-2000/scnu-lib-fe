import React, { useEffect, useState } from 'react';
import { history, Link } from 'umi';
import { Layout, Menu, Button, Dropdown, Avatar, message, Modal } from 'antd';
import { activityRoutes } from '../../Routes/routes';
import {
  isLogined,
  clearToken,
  clearUserID,
  clearRole,
  getUserID,
} from '../../Utils/auth';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import './Frame.less';
import { changeClient } from '@/reducers/globalConfigReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifyApi, getSettingApi } from '@/Services/auth';
import { cleanUserInfo, initUserInfo } from '@/reducers/userReducer';
import { initLoginInUserSetting } from '@/reducers/loginInUserSetting';
import { getPhoto } from '@/photoStorage/photoStorage';
import SignIn from '../Login/SignIn';
import SignUp from '../Login/SignUp';
const { Header, Content, Footer } = Layout;
function Frame(props: any) {
  const dispatch = useDispatch();
  const userInfo = useSelector(store => store.loginInUserSetting);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalState, setModalState] = useState('登录'); // 根据状态显示注册、登录页面
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setModalState('登录'); // 回到登录状态
  };

  useEffect(() => {
    if (isLogined()) {
      getSettingApi(getUserID())
        .then(res => {
          dispatch(initLoginInUserSetting(res.data));
        })
        .catch(err => {
          message.error('Oops!发生了未知的错误');
        });
    }
  }, []);
  const docEl = document.documentElement;
  const resizeEvt =
    'orientationchange' in window ? 'orientationchange' : 'resize'; // 移动端切换横屏或窗口大小改变
  const recalc = function() {
    const clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    dispatch(changeClient(clientWidth));
  };
  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  document.addEventListener('DOMContentLoaded', recalc, false);
  const menu = (
    <Menu
      onClick={p => {
        // 下拉菜单几个选项跳转，在home.tsx架设route
        if (p.key === 'logout') {
          clearToken();
          clearUserID();
          clearRole();
          history.push('/');
          location.reload();
        } else if (p.key === 'User') {
          dispatch(cleanUserInfo());
          getNotifyApi(getUserID())
            .then(res => {
              dispatch(initUserInfo(res.data));
              history.push('/home/user');
            })
            .catch(err => {
              message.error('Oops!发生了未知的错误');
            });
        } else {
          history.push('/');
        }
      }}
    >
      <Menu.Item key="User">用户中心</Menu.Item>
      <Menu.Item key="logout">退出</Menu.Item>
    </Menu>
  );

  const SwitchLoginUser = (): any => {
    // 鉴权判断登录框显示
    if (isLogined()) {
      // antd的子组件也不能同时传入多个
      return (
        <Dropdown overlay={menu}>
          <label>
            <Avatar
              icon={<UserOutlined />}
              src={`${getPhoto(
                `avatarPhoto${userInfo?.id}`,
              )}?dummy=${new Date().getTime()}`}
            ></Avatar>
            <div className="userName">{userInfo?.detail?.name}</div>{' '}
            <DownOutlined />
          </label>
        </Dropdown>
      );
    }
    return (
      <Button type="text" onClick={showModal}>
        注册 | 登录
      </Button>
    );
  };
  return (
    <Layout className="layout">
      <Header className="navbg_selector">
        <div className="LOGO-Menu">
          <a
            className="LOGO"
            onClick={() => {
              history.replace('/');
            }}
          ></a>
          <Menu
            className="navbg_selector"
            mode="horizontal"
            defaultSelectedKeys={['/home/activity']}
          >
            {activityRoutes.map(route => {
              return route.isShow ? (
                <Menu.Item key={route.path}>
                  <Link to={route.path}>{route.title}</Link>
                </Menu.Item>
              ) : null; // 根据token判断显示是否登录
            })}
          </Menu>
        </div>

        <div className="sign-in-up">{SwitchLoginUser()}</div>
      </Header>
      <div
        className="Hero ant-layout-content"
        style={{ color: '@primary-color' }}
      >
        <h2 className="Hero-title">欢迎来到阅马活动系统</h2>
        <p>华南师大图书馆————活动发布、报名、签到</p>
        <div className="Hero-href">
          <a>QQ群</a> - <a>关于</a> - <a>联系我们</a>
        </div>
      </div>
      <Content className="layout-content">
        <div className="site-layout-content">{props.children}</div>
      </Content>
      <Modal
        style={{ maxWidth: '400px', textAlign: 'center' }}
        title={modalState}
        visible={isModalVisible}
        footer={false}
        onCancel={handleModalCancel}
      >
        {modalState === '登录' ? (
          <SignIn setModalState={setModalState} />
        ) : (
          <SignUp setModalState={setModalState} />
        )}
      </Modal>
      <Footer style={{ textAlign: 'center' }}>华师阅马开发小分队</Footer>
    </Layout>
  );
}

export default Frame;
// BUG 刷新后
