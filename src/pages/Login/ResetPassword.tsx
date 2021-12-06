import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

//忘记密码页面，后面再进行协商
export default function ResetPassword(props: any) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Form
        name="resetPassword"
        scrollToFirstError
        style={{ margin: '16px 20px' }}
      >
        <Row>
          <Col>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入你的邮箱！' },
                {
                  type: 'email',
                  message: '请输入正确格式的邮箱地址！',
                },
              ]}
            >
              <Input placeholder="邮箱" />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item>
              <Button>验证码</Button>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="Verification"
          rules={[
            {
              pattern: /^[0-9]*$/,
              message: '只能使用数字组合',
            },
            { required: true, message: '请输入你的验证码', whitespace: true },
          ]}
        >
          <Input placeholder="验证码" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              min: 6,
              message: '请输入大于5个字符的密码',
            },
            {
              max: 20,
              message: '请输入小于20个字符的密码',
            },
            {
              required: true,
              message: '请输入你的密码',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="新密码" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认你的密码',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('确认密码与密码不一致');
              },
            }),
          ]}
        >
          <Input.Password placeholder="确认新密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
