export type ColumnConfig<T> = {
  key: string; // allow nested keys like "user.name"
  label?: string;
  format?: (value: any, row: T) => string;
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

export const formatCSVDataByColumnOrder = <T>(
  rows: T[],
  columns: ColumnConfig<T>[]
) => {
  return rows?.map((row) => {
    const formattedRow: Record<string, any> = {};

    columns.forEach(({ key, label, format }) => {
      let value = getNestedValue(row, key);

      if (format) {
        value = format(value, row);
      } else if (typeof value === "object" && value !== null) {
        const isEmptyObject =
          !Array.isArray(value) && Object.keys(value).length === 0;
        const isEmptyArray = Array.isArray(value) && value.length === 0;

        if (isEmptyObject || isEmptyArray) {
          value = "-";
        } else {
          value = JSON.stringify(value, null, 2);
        }
      } else if (value == null || value === "") {
        value = "-";
      }

      formattedRow[label || key] = value;
    });

    return formattedRow;
  });
};
