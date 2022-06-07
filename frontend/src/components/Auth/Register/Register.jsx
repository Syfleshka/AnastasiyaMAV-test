/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import './Register.scss';
import {
  Button, Form, Input, Select, Tooltip,
} from 'antd';
import Auth from '../Auth';
import { path } from '../../../utils/constants/constants';
import { localize } from '../../../utils/constants/locales/localize';
import * as validMessages from '../../../utils/constants/validMessages';
import { regularExpressions } from '../../../utils/constants/regularExpressions/regularExpressions';
import { regularMessages, regularMessagesError } from '../../../utils/constants/regularExpressions/regularMessages';

const { validUserMessage } = validMessages;

const Register = ({ userLang, handleRegister }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const locale = localize(userLang);

  const onFinish = async (values) => {
    await handleRegister(
      values.name,
      values.email,
      values.password,
      values.lang,
      false, // admin
    )
      .then(() => navigate(path.signin))
      .catch((err) => console.log(err));
  };

  return (
    <Auth title={`${locale.register.title}`}>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        className="form__register"
        initialValues={{
          lang: 'RU',
        }}
      >
        <Tooltip placement="rightBottom" title={regularMessagesError.login}>
          <Form.Item
            name="name"
            label={`${locale.register.fieldNameLogin}`}
            rules={[
              {
                required: true,
                message: validUserMessage.requiredErr,
                whitespace: true,
              },
              {
                pattern: regularExpressions.login,
                message: regularMessages.login,
              },
            ]}
          >
            <Input placeholder={`${locale.register.fieldNameLogin}`} />
          </Form.Item>
        </Tooltip>

        <Form.Item
          name="email"
          label={`${locale.register.fieldNameEmail}`}
          rules={[
            {
              type: 'email',
              message: validUserMessage.emailErr,
            },
            {
              required: true,
              message: validUserMessage.requiredErr,
            },
          ]}
        >
          <Input placeholder={`${locale.register.fieldNameEmail}`} />
        </Form.Item>

        <Tooltip placement="rightBottom" title={regularMessagesError.password}>
          <Form.Item
            name="password"
            label={`${locale.register.fieldNamePass}`}
            rules={[
              {
                required: true,
                message: validUserMessage.requiredErr,
              },
              {
                pattern: regularExpressions.password,
                message: regularMessages.password,
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder={`${locale.register.fieldNamePass}`} />
          </Form.Item>
        </Tooltip>

        <Form.Item
          name="lang"
          label={locale.register.fieldNameLang}
          rules={[
            {
              required: true,
              message: validUserMessage.requiredErr,
            },
          ]}
        >
          <Select>
            <Select.Option value="RU">
              {locale.register.valueLangRU}
            </Select.Option>
            <Select.Option value="EN">
              {locale.register.valueLangEN}
            </Select.Option>
            <Select.Option value="DE">
              {locale.register.valueLangDE}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Регистрация
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={() => navigate(path.signin)}>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Auth>
  );
};

export default inject(({ UserStore }) => {
  const { userLang, handleRegister } = UserStore;

  return {
    userLang,
    handleRegister,
  };
})(observer(Register));
