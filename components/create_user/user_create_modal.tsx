import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  message,
} from "antd";
import UserCreateImageUpload from "./user_create_image_upload";
import axiosClient from "../../plugins/axiosConfig";
import { UserType } from "../../configs/users_configs";

type UserCreateDrawerProps = {
  open: boolean;
  isUpdate: boolean;
  setOpen: Function;
  addNewUser: Function;
  updateUser: Function;
  onModalClose: Function;
  updateItem: UserType | undefined;
};

type FormValuesType = {
  name: string;
  email: string;
  password: string | undefined;
  confirm_password: string | undefined;
};

const CreateUser: React.FC<UserCreateDrawerProps> = ({
  open,
  isUpdate,
  setOpen,
  addNewUser,
  updateUser,
  updateItem,
  onModalClose,
}) => {
  const [form] = Form.useForm();
  const [userImage, setUserImage] = useState(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isUpdate) {
      form.setFieldsValue({
        name: updateItem?.name,
        email: updateItem?.email,
      });

      setImageUrl(updateItem?.profile);
    } else {
      setUserImage(null);
      setImageUrl(undefined);
    }
  }, [isUpdate]);

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setUserImage(null);
    onModalClose();
  };

  const onCreate = (values: FormValuesType) => {
    setLoading(true);
    if (userImage == null) {
      message.error("Image is required!");
      setLoading(false);
      return;
    }
    axiosClient
      .post(
        "/api/users",
        {
          ...values,
          file: userImage,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        addNewUser(res.data.data);
        form.resetFields();
        message.success("New User Successfully added!");
        setUserImage(null);
        setOpen(false);
        setLoading(false);
        onModalClose();
      })
      .catch((err) => {
        setLoading(false);
        message.error("An Error occured please try again!");
      });
  };

  const onUpdate = (values: FormValuesType) => {
    setLoading(true);
    axiosClient
      .post(
        `/api/users/${updateItem?.id}`,
        {
          _method: "PATCH",
          ...values,
          file: userImage,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        updateUser(res.data.data);
        form.resetFields();
        message.success("User Successfully updated!");
        setUserImage(null);
        setOpen(false);
        setLoading(false);
        onModalClose();
      })
      .catch((err) => {
        setLoading(false);
        message.error("An Error occured please try again!");
      });
  };

  const onFinish = (values: FormValuesType) => {
    if (!isUpdate) {
      onCreate(values);
    } else {
      onUpdate(values);
    }
  };

  return (
    <>
      <Modal
        title="Create User"
        open={open}
        footer={false}
        onCancel={onClose}
        centered
      >
        <Spin spinning={loading}>
          <Form layout="vertical" requiredMark form={form} onFinish={onFinish}>
            <div className="flex justify-center">
              <UserCreateImageUpload
                isUpdate={isUpdate}
                image={userImage}
                setImage={setUserImage}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
              />
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Name can't be empty.",
                    },
                    {
                      min: 2,
                      message: "Name must be at least 2 charachters",
                    },
                    {
                      max: 64,
                      message: "Name must be at most 64 charachters",
                    },
                  ]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Email can't be empty.",
                    },
                    {
                      type: "email",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
            </Row>
            {!isUpdate && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Password can't be empty.",
                      },
                      {
                        min: 8,
                        message: "Name must be at least 8 charachters",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                </Col>{" "}
                <Col span={12}>
                  <Form.Item
                    name="confirm_password"
                    label="Confirm Password"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Space className="flex justify-end">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default CreateUser;
