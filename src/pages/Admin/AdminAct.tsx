import { withRouter } from 'react-router-dom';
import React from 'react';
import { Layout, Menu } from 'antd';
import './AdminAct.css';
import { adminRoutes } from '../../Routes/routes';
const { Content, Sider } = Layout;

function AdminAct(props: any) {
  return (
    <Layout>
      <Content className="AdminAct-content">
        <Layout
          className="site-layout-background"
          style={{ padding: '14px 0' }}
        >
          <div className="site-layout-sider">
            <Sider
              className="site-layout-background"
              breakpoint="lg"
              collapsedWidth="0"
              zeroWidthTriggerStyle={{
                top: '-20px',
                color: '#1DA57A',
                backgroundColor: 'white',
                boxShadow: '2px 0 8px rgba(0,0,0,.15)',
                height: '36px',
              }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={['/home/adminAct/listact']}
                defaultOpenKeys={['/home/adminAct/listact']}
                style={{ height: '100%' }}
              >
                {adminRoutes.map(route => {
                  return route.isShow ? (
                    <Menu.Item
                      key={route.path}
                      onClick={p => props.history.push(p.key)}
                    >
                      {route.title}
                    </Menu.Item>
                  ) : null; // 根据token判断显示是否登录
                })}
              </Menu>
            </Sider>
          </div>
          <Content
            style={{
              padding: '10px 24px',
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default withRouter(AdminAct);
