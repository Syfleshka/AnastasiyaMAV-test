/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import './Users.scss';
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { inject, observer } from 'mobx-react';
import {
  Table, Input, Button, Popconfirm, Form, Typography, Select,
} from 'antd';
import * as validMessages from '../../utils/constants/validMessages';
import { regularExpressions } from '../../utils/constants/regularExpressions/regularExpressions';
import { regularMessages } from '../../utils/constants/regularExpressions/regularMessages';

const { validUserMessage } = validMessages;

const EditableContext = React.createContext(null);
const { Option } = Select;

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={
          dataIndex === 'name' ? [
            {
              required: true,
              message: validUserMessage.requiredErr,
              whitespace: true,
            },
            {
              pattern: regularExpressions.login,
              message: regularMessages.login,
            },
          ] : dataIndex === 'email' ? [
            {
              type: 'email',
              message: validUserMessage.emailErr,
            },
            {
              required: true,
              message: validUserMessage.requiredErr,
            },
          ] : null
        }
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const Users = ({ handleAllUsers, usersObj }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    handleAllUsers(token);
  });

  const [dataSource, setDataSource] = useState(usersObj);
  const [count, setCount] = useState(2);

  const handleDelete = (_id) => {
    const newData = dataSource.filter((item) => item._id !== _id);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'Логин',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'Электронный адрес',
      dataIndex: 'email',
      width: '30%',
      editable: true,
    },
    {
      title: 'Язык',
      dataIndex: 'lang',
      width: '10%',
      render: (_, record) => (dataSource.length >= 1 ? (
        <Select defaultValue={record.lang} style={{ width: 120 }}>
          <Option value="RU">RU</Option>
          <Option value="EN">EN</Option>
          <Option value="DE">DE</Option>
        </Select>
      ) : null),
      // editable: true,??????
    },
    {
      title: 'Админ',
      dataIndex: 'admin',
      width: '10%',
      render: (_, record) => (dataSource.length >= 1 ? (
        <Select defaultValue={record.admin} style={{ width: 120 }}>
          <Option value={false}>Нет</Option>
          <Option value>Да</Option>
        </Select>
      ) : null),
      // editable: true,??????
    },
    {
      title: '',
      dataIndex: 'operation',
      width: '30%',
      render: (_, record) => (dataSource.length >= 1 ? (
        <div className="userTable__operation">
          <Popconfirm
            title="Вы действительно хотите удалить пользователя?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Typography.Link>Удалить</Typography.Link>
          </Popconfirm>
          <Popconfirm
            title="Вы действительно хотите сбросить пароль пользователю?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Typography.Link>Сбросить пароль</Typography.Link>
          </Popconfirm>
        </div>
      ) : null),
    },
  ];

  const handleAdd = () => {
    const newData = {
      _id: count,
      name: 'Введите имя',
      email: 'Введите электронный адрес',
      lang: '',
      admin: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row._id === item._id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <div className="content__users">
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Добавить пользователя
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default inject(({ UserStore }) => {
  const {
    usersObj,
    handleAllUsers,
  } = UserStore;

  return {
    usersObj,
    handleAllUsers,
  };
})(observer(Users));
