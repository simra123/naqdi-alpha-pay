const errorsArray = [400, 401, 404, 500];

export const callApiHook = async ({
  apiCall,
  statusCode = 200,
  successCallBack,
}) => {
  const response = await apiCall;

  console.log(response, "_____________________");

  if (response?.status == statusCode) {
    return successCallBack(response.data);
  }
};
