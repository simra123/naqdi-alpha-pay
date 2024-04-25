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
