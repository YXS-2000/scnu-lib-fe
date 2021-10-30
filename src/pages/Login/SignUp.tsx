import React from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  message,
  Cascader,
} from 'antd';
import { getNextAvailableIDApi, loginApi, signUpApi } from '@/Services/auth';
import PropertyRequiredError from '@/error/PropertyRequiredError';
import { setRole, setToken, setUserID } from '@/Utils/auth';
import { collegeList } from './collegeList';
type valueProps = {
  email: string;
  password: string;
  nickname: string;
  college: string[];
  studentId: string;
};
//注册页面
const { Option } = Select;
function SignUp(props: any) {
  const [form] = Form.useForm();

  const onFinish = async (values: valueProps) => {
    const user = {
      username: values.email,
      password: values.password,
      detail: {
        name: values.nickname,
        college: values.college.join('/'),
        studentId: values.studentId,
      },
    };
    try {
      console.log(user);
      await signUpApi(user);
      props.setModalState('登录');
      message.success('注册成功');
    } catch (err) {
      console.log(err.response);
      if (err.response?.status === 400) {
        message.error('该帐号已被注册，换一个试试?');
      } else if (err.response?.status === 500) {
        message.error('该学号已被注册，换一个试试?');
      } else {
        console.log(err.message);
        message.error('Oops！遇到了未知的错误，请重试或联系客服');
      }
    }
  };
  function filter(inputValue, path) {
    return path.some(
      option =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{ width: '100%', margin: '16px 20px' }}
      >
        <Form.Item
          name="nickname"
          rules={[
            { required: true, message: '请输入你的昵称', whitespace: true },
            { max: 31, message: '请输入小于32位字符的昵称' },
          ]}
        >
          <Input placeholder="昵称" />
        </Form.Item>
        <Form.Item
          name="studentId"
          rules={[
            {
              pattern: /^[0-9]*$/,
              message: '只能使用数字组合',
            },
            { required: true, message: '请输入你的学号', whitespace: true },
            { max: 11, min: 10, message: '请输入10-11位数字的学号' },
          ]}
        >
          <Input placeholder="学号" />
        </Form.Item>

        <Form.Item
          name="college"
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
            placeholder="学院"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              pattern: /\w+$/,
              message: '只能使用数字、字母和下划线组合',
            },
            { required: true, message: '请输入你的帐号', whitespace: true },
          ]}
        >
          <Input placeholder="帐号" />
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
          <Input.Password placeholder="密码" />
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
          <Input.Password placeholder="确认密码" />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject('请同意用户协议'),
            },
          ]}
        >
          <Checkbox>
            我已经阅读并同意 <a href="">用户协议</a>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            注册
          </Button>{' '}
          或
          <Button type="link" onClick={() => props.setModalState('登录')}>
            已经有帐号了？现在登录
          </Button>{' '}
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUp;
