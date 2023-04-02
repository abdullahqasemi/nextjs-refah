import React, { useEffect, useState } from "react";
import { Avatar, Button, Table, message } from "antd";
import axiosClient from "../plugins/axiosConfig";
import { type UserType, type TableParams } from "../configs/users_configs";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import CreateUser from "./create_user/user_create_modal";
import { UserOutlined } from "@ant-design/icons";

const columns: ColumnsType<UserType> = [
  {
    title: "ID",
    dataIndex: "id",
    width: 100,
  },
  {
    title: "Image",
    dataIndex: "profile",
    width: 80,
    render: (text: string, record: object, index: number) => (
      <Avatar src={text} icon={<UserOutlined />} size={40} />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const Datatable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserType[]>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [createUser, setCreateUser] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateItem, setUpdateItem] = useState<UserType | undefined>();

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const fetchData = () => {
    setLoading(true);
    axiosClient
      .get(`/api/users`, {
        params: {
          page: tableParams.pagination?.current,
          per_page: tableParams.pagination?.pageSize,
        },
      })
      .then((result) => result.data)
      .then((data) => {
        console.log(data);
        setData(data.data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.total,
          },
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const addNewUser = (user: UserType) => {
    setData((oldData) => {
      if (oldData) {
        return [user, ...oldData];
      } else {
        return [user];
      }
    });
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: data?.length ?? 0 + 1,
      },
    });
  };

  const updateUser = (user: UserType) => {
    setData((oldData) => {
      return oldData?.map((item) => {
        if (item.id == user.id) {
          return user;
        }
        return item;
      });
    });
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: data?.length ?? 0 + 1,
      },
    });
    setIsUpdate(false);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onCreate = () => {
    setIsUpdate(false);
    setUpdateItem(undefined);
    setCreateUser(true);
  };

  const onUpdate = () => {
    if (selectedRowKeys.length == 0) {
      message.error("You must select at least 1 item to update");
      return;
    }
    if (selectedRowKeys.length > 1) {
      message.error("You can select at most 1 item to update");
      return;
    }
    const item = data?.find((item2) => item2.id == selectedRowKeys[0]);

    setUpdateItem(item);
    setIsUpdate(true);
    setCreateUser(true);
  };

  return (
    <>
      <div className="flex py-3">
        <Button type="primary" className="me-auto" onClick={onUpdate}>
          Update
        </Button>
        <Button type="primary" className="ms-auto" onClick={onCreate}>
          Create User
        </Button>
      </div>
      <CreateUser
        open={createUser}
        setOpen={setCreateUser}
        addNewUser={addNewUser}
        updateUser={updateUser}
        isUpdate={isUpdate}
        updateItem={updateItem}
      />
      <Table
        scroll={{ y: 500 }}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </>
  );
};

export default Datatable;
