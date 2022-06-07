/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import './Profile.scss';
import {
  Button, Form, Input, Select, Checkbox, Tooltip,
} from 'antd';
import Auth from '../Auth';
import { path } from '../../../utils/constants/constants';
import { localize } from '../../../utils/constants/locales/localize';
import * as validMessages from '../../../utils/constants/validMessages';
import { regularExpressions } from '../../../utils/constants/regularExpressions/regularExpressions';
import { regularMessages, regularMessagesError } from '../../../utils/constants/regularExpressions/regularMessages';

const { validUserMessage } = validMessages;

const Profile = ({
  userName,
  userEmail,
  userAdmin,
  userLang,
  handleEditUserInfo,
  handleEditUserAdmin,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const locale = localize(userLang);

  const onFinish = async (values) => {
    const token = localStorage.getItem('token');

    if (userAdmin) {
      await handleEditUserAdmin(
        token,
        values.name,
        values.email,
        values.admin,
        values.lang,
      )
        .then(() => navigate(path.profile))
        .catch((err) => console.log(err));
    } else {
      await handleEditUserInfo(token, values.name, values.email, values.lang)
        .then(() => navigate(path.profile))
        .catch((err) => console.log(err));
    }
  };

  return (
    <Auth title={`${locale.profile.title} ${userName}!`}>
      <Form
        form={form}
        name="profile"
        onFinish={onFinish}
        scrollToFirstError
        className="form__profile"
        initialValues={{
          name: userName || '',
          email: userEmail || '',
          lang: userLang || '',
          admin: userAdmin || false,
        }}
      >
        <Tooltip placement="rightBottom" title={regularMessagesError.login}>
          <Form.Item
            name="name"
            label={`${locale.profile.fieldNameLogin}`}
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
            <Input placeholder={`${locale.profile.fieldNameLogin}`} />
          </Form.Item>
        </Tooltip>

        <Form.Item
          name="email"
          label={`${locale.profile.fieldNameEmail}`}
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
          <Input placeholder={`${locale.profile.fieldNameEmail}`} />
        </Form.Item>

        {userAdmin && (
          <Form.Item name="admin" valuePropName="checked">
            <Checkbox>{locale.profile.fieldNameAdmin}</Checkbox>
          </Form.Item>
        )}

        <Form.Item
          name="lang"
          label={locale.profile.fieldNameLang}
          rules={[
            {
              required: true,
              message: validUserMessage.requiredErr,
            },
          ]}
        >
          <Select>
            <Select.Option value="RU">
              {locale.profile.valueLangRU}
            </Select.Option>
            <Select.Option value="EN">
              {locale.profile.valueLangEN}
            </Select.Option>
            <Select.Option value="DE">
              {locale.profile.valueLangDE}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="form__profile-btnGroup">
            <Button type="primary" htmlType="submit">
              Сохранить изменения
            </Button>
            <Button type="default">
              Удалить профиль
            </Button>
            <Button type="default">
              Сменить пароль
            </Button>
            <Button type="default" onClick={() => navigate(path.contacts)}>
              На главную
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Auth>
  );
};

export default inject(({ UserStore }) => {
  const {
    userName,
    userEmail,
    userAdmin,
    userLang,
    handleEditUserInfo,
    handleEditUserAdmin,
  } = UserStore;

  return {
    userName,
    userEmail,
    userAdmin,
    userLang,
    handleEditUserInfo,
    handleEditUserAdmin,
  };
})(observer(Profile));
