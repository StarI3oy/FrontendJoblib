import {
  Table,
  Button,
  Spin,
  DatePicker,
  Input,
  Radio,
  notification,
  Result,
  message,
  Upload,
  UploadProps,
  UploadFile,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

import { useState, useEffect, createContext, useMemo } from "react";

import { Download, Predict } from "./scripts/requests";
import { UploadOutlined } from "@ant-design/icons";
import { handleUploadPred } from "./scripts/uploads";

const dateFormat = "DD.MM.YYYY";
const columns = [
  {
    title: "Дата и время",
    dataIndex: "DateTime",
    key: "DateTime",
  },
  {
    title: "Часы",
    dataIndex: "hours",
    key: "hours",
  },
  {
    title: "Вид давления",
    dataIndex: "mode",
    key: "mode",
  },
  {
    title: "КС",
    dataIndex: "station",
    key: "station",
  },
  {
    title: "Прогноз давления",
    dataIndex: "Result",
    key: "Result",
  },
];

export default function App() {
  useEffect(() => {
    setLoading(false);
  }, []);

  const [datePick, setDatePick] = useState<Dayjs>(
    dayjs("01.12.2024", dateFormat)
  );
  const [ks, setKs] = useState("15");
  const [pmode, setPmode] = useState("Pin");
  const [send, setSend] = useState(false);
  const [hours, setHours] = useState("48h");
  const [error, setError] = useState(false);
  const [tablename, setTableName] = useState("");
  const [loading, setLoading] = useState(true);
  const [predict, setPredict] = useState([]);
  const [download, setLoadingDownload] = useState(false);
  // const [upload, setLoadingUpload] = useState(false);
  // const [weatherFile, setWeatherFile] = useState<InputRef | null>();
  // const [inputFile, setInputFile] = useState<InputRef | null>();
  const [notificationApi, contextHolder] = notification.useNotification();
  console.log(notificationApi);
  const Context = createContext({ name: "Default" });
  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);
  // const weatherRefUpload = useRef<HTMLInputElement>(null);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const Predprops: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    maxCount: 4,
    multiple: true,
  };

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="bg-white space-y-4 w-full px-4 py-8 sm:px-6 md:max-w-lg md:mx-auto">
        <Spin className="w-full mb-4" spinning={loading} />
        <div className="flex flex-col items-start space-y-2">
          Дата на основе которой делается прогноз модели
          <DatePicker
            value={datePick}
            onChange={(date) => {
              setDatePick(date);
            }}
            placeholder={"Выберите дату"}
            format={"DD.MM.YYYY"}
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-col items-start space-y-2">
            <h3 className="font-medium">Время прогноза:</h3>
            <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2">
              <div className="flex items-center space-x-2">
                <Radio.Group
                  onChange={(e) => setHours(e.target.value)}
                  value={hours}
                >
                  <Radio value={"48h"}>На сутки</Radio>
                  <Radio value={"72h"}>На двое суток</Radio>
                  <Radio value={"96h"}>На трое суток</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-col items-start space-y-2">
            <h3 className="font-medium">Вид давления:</h3>
            <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2">
              <div className="flex items-center space-x-2">
                <Radio.Group
                  onChange={(e) => setPmode(e.target.value)} 
                  value={pmode}
                >
                  <Radio value={"Pin"}>Pin</Radio>
                  <Radio value={"Pout"}>Pout</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-col items-start space-y-2">
            <h3 className="font-medium">Станция:</h3>
            <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2">
              <div className="flex items-center space-x-2">
                <Radio.Group onChange={(e) => setKs(e.target.value)} value={ks}>
                  <Radio value={"15"}>КС-15</Radio>
                  <Radio value={"16"}>КС-16</Radio>
                  <Radio value={"17"}>КС-17</Radio>
                  <Radio value={"19"}>КС-19</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="table-name">Название таблицы</label>
          <Input
            // id="table-name"
            placeholder="Введите название и нажмите Enter"
            // onEndedCapture={(e) => setTableName(e.target.value)}
            // onEnded={(e) => setTableName(e.target)}
            // value={tablename}
            onPressEnter={async (e) => {
              setTableName(e.currentTarget.value);
              message.success(
                "Смена названия таблицы на " + e.currentTarget.value
              );
            }}
          />
        </div>
        <Table className="w-full" columns={columns} dataSource={predict} />

        <div className="space-y-2">
          <div className="flex flex-col items-start space-y-2">
            <Button
              onClick={() =>
                Predict(
                  setLoading,
                  setSend,
                  setPredict,
                  setError,
                  ks,
                  pmode,
                  hours,
                  datePick.format(dateFormat)
                )
              }
              className="px-4 py-2"
            >
              Прогноз модели
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-col items-start space-y-2">
            <Button
              loading={download}
              onClick={() =>
                Download(
                  setLoadingDownload,
                  // setTableName,
                  ks,
                  pmode,
                  hours,
                  datePick.format(dateFormat),
                  tablename
                )
              }
              className="px-4 py-2"
            >
              Экспорт таблицы с последним результатом, по заданным параметрам
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-row items-start">
            <Upload {...Predprops}>
              <Button icon={<UploadOutlined />}>
                Загрузка данных для модели
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={() =>
                handleUploadPred(
                  fileList,
                  setError,
                  setSend,
                  setFileList,
                  setUploading
                )
              }
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginLeft: 6 }}
            >
              {uploading ? "Файлы отправляются" : "Загрузить файлы"}
            </Button>
          </div>
        </div>
        {/* <div className="space-y-2">
          <div className="flex flex-row items-start">
            <Upload {...Predprops}>
              <Button icon={<UploadOutlined />}>Загрузка погоды</Button>
            </Upload>
            <Button
              type="primary"
              onClick={() => handleUpload(fileList)}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginLeft: 6 }}
            >
              {uploading ? "Файлы отправляются" : "Загрузить файлы"}
            </Button>
          </div>
        </div> */}

        <div className="space-y-2">
          <div className="flex flex-col items-start space-y-2">
            {send ? (
              error ? (
                <Result status="warning" />
              ) : (
                <Result status="success" />
              )
            ) : (
              <Result status="info" />
            )}
            {error ? "Случилась ошибка (попробуйте ввести данные заново)." : ""}
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}
