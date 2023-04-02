import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
const { Header, Sider, Content } = Layout;

type MyPageProps = {
  children: React.ReactNode;
};

const CLayout: React.FC<MyPageProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div id="components-layout-demo-custom-trigger">
      <Layout style={{ height: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Users",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "nav 2",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "nav 3",
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              overflowY: "auto",
            }}
          >
            {children}
          </Content>
        </Layout>
        <style jsx global>
          {`
            #components-layout-demo-custom-trigger .trigger {
              padding: 0 24px;
              font-size: 18px;
              line-height: 64px;
              cursor: pointer;
              transition: color 0.3s;
            }

            #components-layout-demo-custom-trigger .trigger:hover {
              color: #1890ff;
            }

            #components-layout-demo-custom-trigger .logo {
              height: 32px;
              margin: 16px;
              background: rgba(255, 255, 255, 0.3);
            }
          `}
        </style>
      </Layout>
    </div>
  );
};
export default CLayout;
