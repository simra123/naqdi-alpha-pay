// File: components/table/utils.ts

export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

export const sortData = (rows: any[], sortConfig: { key: string; direction: 'ascending' | 'descending' }) => {
  return [...rows].sort((a, b) => {
    const aVal = getNestedValue(a, sortConfig.key);
    const bVal = getNestedValue(b, sortConfig.key);
    if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });
};
