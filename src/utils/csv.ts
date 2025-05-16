export type ColumnConfig<T> = {
  key: Extract<keyof T, string>; // only string keys allowed
  label?: string;
  format?: (value: any, row: T) => string;
};

export const formatCSVDataByColumnOrder = <T>(
  rows: T[],
  columns: ColumnConfig<T>[]
) => {
  return rows?.map((row) => {
    const formattedRow: Record<string, any> = {};

    columns.forEach(({ key, label, format }) => {
      let value = (row as any)[key];

      console.log(`[${key}] : ${value}` , row);

      if (format) {
        // ✅ Custom formatting with full row access
        value = format(value, row);
      } else if (typeof value === "object" && value !== null) {
        // Check for empty object or empty array
        const isEmptyObject =
          !Array.isArray(value) && Object.keys(value).length === 0;
        const isEmptyArray = Array.isArray(value) && value.length === 0;

        if (isEmptyObject || isEmptyArray) {
          value = "-";
        } else {
          // Stringify deeply if not empty
          value = JSON.stringify(value, null, 2);
        }
      } else if (!value) {
        value = "-";
      }

      formattedRow[label || key] = value;
    });

    return formattedRow;
  });
};
