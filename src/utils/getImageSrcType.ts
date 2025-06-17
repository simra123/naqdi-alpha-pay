export const getUrlOrObjectUrl = (input: any) => {
  if (typeof input === "string") {
    return input;
  } else if (input instanceof File) {
    return URL.createObjectURL(input);
  } else {
    return null;
  }
};

export const urlToFile = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf("/") + 1);
    return new File([blob], filename);
  } catch (error) {
    return null;
  }
};
