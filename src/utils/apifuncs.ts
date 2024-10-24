const errorsArray = [400, 401, 404, 500];

interface callApi {
  apiCall: any;
  statusCode?: number;
  successCallBack?: (data: any) => void;
}

export const callApiHook = async ({
  apiCall,
  statusCode = 200,
  successCallBack,
}: callApi) => {
  const response = await apiCall;



  if (response?.status == statusCode) {
    return successCallBack(response.data);
  }
};

export const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
