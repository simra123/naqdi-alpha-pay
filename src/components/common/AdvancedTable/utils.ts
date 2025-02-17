import { ListData } from "./types";

interface ListConfig {
  views: any[];
  groups: any[];
}

export const getSelectedViewColumns = (
  listConfig: ListConfig,
  selectedValue: string,
  localFilters: any[] = []
) => {
  const selectedView = listConfig?.views?.find(
    (view: any) => view.name === selectedValue
  );

  if (localFilters.length > 0) {
    return localFilters;
  }

  return selectedView ? selectedView.columns : [];
};

export const getColumnNames = (
  columns: any[],
  listConfig: ListConfig
): string[] => {
  const sortedColumns = columns.sort((a, b) => a.sequence - b.sequence);

  return sortedColumns
    .map((col) => {
      const meta = listConfig?.groups
        ?.flatMap((group: any) => group.meta)
        ?.find((meta: any) => meta?.id === col?.listColumnsMeta?.id);

      if (meta) {
        const columnId = meta.name;
        return columnId
          .split(".")
          .map((part: any, index: number) =>
            index === 0 ? part : part.charAt(0) + part.slice(1)
          )
          .join("");
      }

      return null;
    })
    .filter((name) => name !== null);
};

// Assuming the state array is called "columnsState"
export const updateColumnSortState = (newColumn, colsArray) => {
  const { name } = newColumn.listColumnsMeta;
  const existingColumnIndex = colsArray.findIndex(
    (column) => column.listColumnMeta.name === name
  );

  if (existingColumnIndex === -1) {
    // Column doesn't exist, push a new one with default "ASC"
    colsArray.push({
      sortOrder: "DESC",
      listColumnMeta: {
        name: newColumn.listColumnsMeta.name,
      },
    });
  } else {
    // Column exists, toggle the sort order
    const existingColumn = colsArray[existingColumnIndex];
    existingColumn.sortOrder =
      existingColumn.sortOrder === "ASC" ? "DESC" : "ASC";
  }

  // Optionally, return the updated state if needed
  return [...colsArray];
};

export const updateFilterState = (
  newColumn: any,
  values: string[],
  filtersArray: any[],
  operator = "EQUALS"
) => {
  const { name } = newColumn.listColumnsMeta;
  const existingColumnIndex = filtersArray.findIndex(
    (column) => column.listColumnMeta.name === name
  );

  // If the value is an empty string, remove the corresponding column from the filtersArray
  if (values[0] === "") {
    if (existingColumnIndex !== -1) {
      // Remove the column from the state if it exists
      filtersArray.splice(existingColumnIndex, 1);
    }
  } else {
    // Create the formatted object
    const formattedColumn = {
      operator,
      values: values,
      listColumnMeta: {
        name: newColumn.listColumnsMeta.name,
      },
    };

    if (existingColumnIndex === -1) {
      // Column doesn't exist, push the new formatted object
      filtersArray.push(formattedColumn);
    } else {
      // Column exists, update the existing one (if needed)
      filtersArray[existingColumnIndex] = formattedColumn;
    }
  }

  // Optionally, return the updated state
  return [...filtersArray];
};

export const getSortState = (columnName: string, sortColsArray: any[]) => {
  const sortedColumn = sortColsArray.find(
    (item) => item?.listColumnMeta?.name == columnName
  );
  return sortedColumn?.sortOrder;
};

export const formatClientHeader = (header: string): string => {
  const shouldCapitalize = (word: string): boolean => {
    return word.length <= 3 || /^[A-Z]+$/.test(word);
  };
  const words = header.split(/(?=[A-Z])|\.|(?<=user|client)(?=[a-z])/g);
  const formattedWords = words.map((word) => {
    word = word.toLowerCase();

    if (shouldCapitalize(word)) {
      return word.toUpperCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  });
  return formattedWords.join(" ").trim();
};

export const getValue = (value: string | number, type?: string | undefined) => {
  if (type === "boolean") return value === "TRUE";
  if (type === "number") return Number(value);
  if (type === "date") return new Date(value).toISOString();
  return value;
};

export const getFormattedValues = (filter: any) => {
  if (filter.type === "boolean") {
    return [filter.value === true || filter.value === "true"];
  }
  if (filter.condition === "BETWEEN" && filter.type === "number") {
    return filter.value.map((val: string) => Number(val));
  }
  return filter.condition === "BETWEEN"
    ? filter.value
    : [getValue(filter.value, filter.type)];
};

export const getPaginationPages = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | string)[] => {
  // Ensure totalPages and currentPage are valid
  if (totalPages <= 0 || currentPage < 1 || currentPage > totalPages) return [];

  const totalPageNumbers = siblingCount * 2 + 3; // 5 includes current, first, last, and 2 ellipses
  const pages: (number | string)[] = [];

  if (totalPages <= totalPageNumbers) {
    // Show all pages if total pages fit within the range
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  console.log({
    leftSiblingIndex,
    rightSiblingIndex,
    showLeftEllipsis,
    showRightEllipsis,
  });

  if (showLeftEllipsis) {
    pages.push("..."); // Left ellipsis
  }

  // Add middle pages
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("..."); // Right ellipsis
  }
  if (!pages?.includes(1)) {
    pages?.unshift(1);
  }

  // Add the last page
  if (!pages?.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
};

export const sortBySequence = (array: ListData) => {
  return array.sort((a, b) => a.sequence - b.sequence);
};
