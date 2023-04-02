import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

type UserImageUploadedProps = {
  image: any;
  setImage: Function;
  imageUrl: string | undefined;
  setImageUrl: Function;
  isUpdate: boolean;
};

const UserCreateImageUpload: React.FC<UserImageUploadedProps> = ({
  image,
  setImage,
  imageUrl,
  setImageUrl,
  isUpdate,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isUpdate) {
      if (image != null) {
        getBase64(image as RcFile, (url) => {
          setLoading(false);
          setImageUrl(url);
        });
      } else {
        setImageUrl(undefined);
      }
    }
  }, [image]);

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
    setImage(info.file.originFileObj);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <ImgCrop rotationSlider aspect={1}>
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader overflow-hidden mx-auto flex justify-center"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" className=" w-full rounded-full" />
          ) : (
            uploadButton
          )}
        </Upload>
      </ImgCrop>
    </>
  );
};

export default UserCreateImageUpload;
