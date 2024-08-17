/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadFile, message, UploadProps, GetProp } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const handleUploadPred = (
  predfileList: UploadFile<any>[],
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setSend: React.Dispatch<React.SetStateAction<boolean>>,
  setpredFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>,
  setUploadingPred: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const formData = new FormData();
  predfileList.forEach((file) => {
    formData.append("files", file as FileType);
  });
  setUploadingPred(true);
  setSend(false);
  // You can use any AJAX library you like
  fetch("http://127.0.0.1:8000/datasets/upload_predict", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      setpredFileList([]);
      message.success("upload successfully.");
      setError(false);
    })
    .catch((err) => {
      console.log(err)
      message.error("upload failed.");
      setError(true);
    })
    .finally(() => {
      setUploadingPred(false);
      setSend(true);
    });
};
export const handleUploadWeather = (
  weatherfileList: UploadFile<any>[],
  setweatehrFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>,
  setUploadingWeather: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const formData = new FormData();
  weatherfileList.forEach((file) => {
    formData.append("files", file as FileType);
  });
  setUploadingWeather(true);
  // You can use any AJAX library you like
  fetch("http://127.0.0.1:8000/datasets/upload_predict", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      setweatehrFileList([]);
      message.success("upload successfully.");
    })
    .catch(() => {
      message.error("upload failed.");
    })
    .finally(() => {
      setUploadingWeather(false);
    });
};
