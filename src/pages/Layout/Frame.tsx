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
import ResetPassword from '../Login/ResetPassword';
const { Header, Content, Footer } = Layout;
function Frame(props: any) {
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalState, setModalState] = useState('登录'); // 根据状态显示注册、登录页面
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setModalState('登录'); // 回到登录状态
  };
  const userInfo = useSelector((store: any) => store.loginInUserSetting);
  //条件渲染样式
  let locPath: string = props.children.props.location.pathname;

  useEffect(() => {
    console.log('children', props.children.props.location);
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
            <DownOutlined className="downoutlined" />
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
      <Header className={locPath === '/home/activity' ? 'header-none' : ''}>
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
        {modalState === '登录' && <SignIn setModalState={setModalState} />}
        {modalState === '注册' && <SignUp setModalState={setModalState} />}
        {modalState === '忘记密码' && (
          <ResetPassword setModalState={setModalState} />
        )}
      </Modal>
      <Footer style={{ textAlign: 'center' }} className="footer-container">
        华师阅马开发小分队
        <a
          href="https://www.yuque.com/docs/share/d3502a8f-432b-4d82-a38d-34c27edcd605?# 《联系方式》"
          target="_blank"
        >
          QQ群-关于-联系我们
        </a>
      </Footer>
    </Layout>
  );
}

export default Frame;
// BUG 刷新后
