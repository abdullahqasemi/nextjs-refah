import React, { useEffect, useState } from "react";
import { Avatar, Button, Popconfirm, Row, Table, message } from "antd";
import axiosClient from "../plugins/axiosConfig";
import { type UserType, type TableParams } from "../configs/users_configs";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import CreateUser from "./create_user/user_create_modal";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { Input } from "antd";

const UserData: React.FC = () => {
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

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text: string, record: UserType, index: number) => (
        <div className="flex">
          <Button
            type="primary"
            onClick={() => {
              const item = data?.find((item2) => item2.id == record.id);
              setUpdateItem(item);
              setIsUpdate(true);
              setCreateUser(true);
            }}
            ghost
            icon={<EditOutlined />}
          />
          <div className="mx-1"></div>
          <Popconfirm
            title="Delete the User"
            description="Are you sure to delete this user?"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            onConfirm={async () => {
              onDelete([record.id]);
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    debouncedSearchTerm,
  ]);

  const fetchData = () => {
    setLoading(true);
    axiosClient
      .get(`/api/users`, {
        params: {
          page: tableParams.pagination?.current,
          per_page: tableParams.pagination?.pageSize,
          search: debouncedSearchTerm,
        },
      })
      .then((result) => result.data)
      .then((data) => {
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

  const onDelete = (user_ids: Array<string>) => {
    axiosClient
      .delete("/api/users/id", { data: { user_ids } })
      .then((result) => {
        fetchData();
        setSelectedRowKeys([]);
        message.success("Selected users successfully deleted!");
      })
      .catch((err) => {
        message.error("An Error occured please try again!");
      });
  };

  const onDeleteMulti = () => {
    if (selectedRowKeys.length == 0) {
      message.error("You must select at least 1 item to delete");
      return;
    }
    onDelete(selectedRowKeys.map((item) => item.toString()));
  };

  const onModalClose = () => {
    setUpdateItem(undefined);
    setIsUpdate(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className=" text-3xl font-semibold">Users</h1>
        <div>
          <Input
            placeholder="Search..."
            size={"large"}
            className="px-4"
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex py-3">
        <Button type="primary" className="me-3" onClick={onUpdate}>
          Edit
        </Button>
        <Popconfirm
          title="Delete Users"
          description={`Are you sure to delete ${selectedRowKeys.length} user(s)?`}
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onConfirm={onDeleteMulti}
        >
          <Button danger className="me-auto" onClick={() => {}}>
            Delete
          </Button>
        </Popconfirm>
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
        onModalClose={onModalClose}
      />
      <Table
        scroll={{ y: 500, x: 1000 }}
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

export default UserData;
