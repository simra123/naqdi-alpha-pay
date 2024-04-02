export const callApiHook = async ({
  apiCall,
  statusCode = 200,
  successCallBack,
}) => {
  const response = await apiCall;

  if (response.status == statusCode) {
    return successCallBack();
  }
};
