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
    console.log("Show all pages if total pages fit within the range");
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
