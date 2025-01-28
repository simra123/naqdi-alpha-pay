import { ModulesEnum } from "@/constants/types";

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

function openInNewTab(url) {
  if (!url) {
    console.error("URL is required to open a new tab.");
    return;
  }

  const newTab = window.open(url, "_blank");
  if (newTab) {
    newTab.focus(); // Focus on the new tab if it was successfully opened
  } else {
    console.error(
      "Failed to open the new tab. It might be blocked by the browser."
    );
  }
}

export const sendPaymentInvoiceWhatsapp = ({
  client_name,
  currency,
  network,
  amount,
  address,
  phone_number,
}) => {
  let MessageContent = `
  Hi ${client_name}! 
  
  This is to inform you that a payment has been initiated for you from Alpha’s Pay. Following are the details: 
  
  Coin: ${currency} 
  
  Network: ${network} 
  
  Amount: ${amount}
  
  Wallet Address: ${address} 
  
  
  In case of any query contact  
  
  
  Regards, 
  
  Alpha’s Pay Team. 
  `;

  let whatsappLink = `https://wa.me/${phone_number}?text=${encodeURIComponent(
    MessageContent
  )}`;

  return openInNewTab(whatsappLink);
};
