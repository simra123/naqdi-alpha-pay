import { useState } from "react";
import { unparse } from "papaparse";

interface UseCSVDownloaderReturn {
  csvLoading: boolean;
  csvError: string | null;
  generateAndDownloadCSV: (
    jsonData: Record<string, any>[],
    filename?: string
  ) => void;
}

export function useCSVDownloader(): UseCSVDownloaderReturn {
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  const generateAndDownloadCSV = (
    jsonData: Record<string, any>[],
    filename = "data.csv"
  ) => {
    setCsvLoading(true);
    setCsvError(null);

    try {
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error("Invalid or empty data");
      }

      // Convert array of objects to CSV string
      const csv: string = unparse(jsonData);

      // Create a Blob and trigger download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setCsvError(errorMessage);
    } finally {
      setCsvLoading(false);
    }
  };

  return { csvLoading, csvError, generateAndDownloadCSV };
}
