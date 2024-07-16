import saveAs from "file-saver";

export function Predict(
  setLoadingPredict: React.Dispatch<React.SetStateAction<boolean>>,
  setSend: React.Dispatch<React.SetStateAction<boolean>>,
  setPredict: React.Dispatch<React.SetStateAction<never[]>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  ks: string,
  pmode: string,
  hours: string,
  date: string
) {
  setLoadingPredict(true);

  fetch(
    "/model/predict?ks=" +
      ks +
      "&pmode=" +
      pmode +
      "&hours=" +
      hours +
      "&date=" +
      date,
    {
      method: "GET",
      redirect: "follow",
    }
  )
    .then((response) => {
      setSend(true);
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        return Promise.reject("error 404");
      } else {
        return Promise.reject("some other error: " + response.status);
      }
    })
    .then((result) => {
      console.log(result);
      setPredict(result);
      setError(false);
      setLoadingPredict(false);
    })
    .catch((error) => {
      console.log("СЛУЧИЛАСЬ ОШИБКА");
      setError(true);
      setLoadingPredict(false);
      console.error(error);
    });
}

export function Download(
  setLoadingDownload: React.Dispatch<React.SetStateAction<boolean>>,
  // setTableName: React.Dispatch<React.SetStateAction<string>>,
  ks: string,
  pmode: string,
  hours: string,
  date: string,
  table_name: string | null
) {
  setLoadingDownload(true);
  setLoadingDownload(false);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/octet-stream");
  myHeaders.append("Content-Disposition", 'filename="result.xlsx"');
  fetch(
    "/results/download?ks=" +
      ks +
      "&pmode=" +
      pmode +
      "&hours=" +
      hours +
      "&date=" +
      date,
    {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    }
  )
    .then((response) => response.blob())
    .then((blob) => {
      const title = table_name+".xlsx"
      console.log(title)
      console.log("titletiltetiseiltjseilj")
      saveAs(blob, title);
    })
    .catch((error) => console.error(error));
}
export function Upload(
  fil_: string | Blob,
  setLoadingUpload: React.Dispatch<React.SetStateAction<boolean>>
) {
  setLoadingUpload(true);
  const formdata = new FormData();
  formdata.append("file", fil_);

  fetch("/upload?ks=15&pmode=Pin&hours=48h", {
    method: "POST",
    body: formdata,
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
