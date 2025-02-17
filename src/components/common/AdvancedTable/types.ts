export interface FilterOption {
  id: number;
  label: string;
  value: string;
  checked?: boolean;
  type?: "string" | "date" | "boolean" | "number";
  condition?: string;
}

interface MetaData {
  name: string;
  label: string;
  type?: string;
}

type ListColumnsMeta = {
  id: number;
  name: string;
  label: string;
  type: "DATE" | "STRING"; // You can add more types if needed
  isFilterAble: boolean;
  isSortable: boolean;
  listId: number;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
};

type ListItem = {
  id: number;
  sequence: number;
  isSticky: boolean;
  listColumnsMetaId: number;
  listViewFilterId: number;
  created_at: string | null;
  updated_at: string | null;
  dataValidator?: (value: any, row: any) => any;
  link?: (row: any) => any;
  copyable?: boolean;
  deleted_at: string | null;
  listColumnsMeta: ListColumnsMeta;
};

export type ListData = ListItem[];


type ListConfig = {
  id: number;
  name: string;
  appName: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  groups: any[];
  views: any[];
  filters: any[];
  sort: any[];
};

export type ListApiResponse = {
  result: any[];
  total: number;
  listConfig: ListConfig;
};




export interface FilterSortState {
  sort: { sortOrder: string; listColumnMeta: { name: string } }[];
  filters: {
    operator: string;
    values: string[];
    listColumnMeta: { name: string };
  }[];
}

type FilterCriteria = {
  string: Array<{ label: string; value: string }>;
  date: Array<{ label: string; value: string }>;
  boolean: Array<{ label: string; value: boolean }>;
  number: Array<{ label: string; value: string }>;
};

const filterCriteria: FilterCriteria = {
  string: [
    { label: "Starts With", value: "STARTS_WITH" },
    { label: "Ends With", value: "ENDS_WITH" },
    { label: "Contains", value: "CONTAINS" },
  ],
  date: [
    { label: "Greater Than", value: "GREATER_THAN" },
    { label: "Less Than", value: "LESS_THAN" },
    { label: "Equal To", value: "EQUAL_TO" },
    { label: "Between", value: "BETWEEN" },
    { label: "Not Equal", value: "NOT_EQUAL" },
  ],
  boolean: [
    { label: "True", value: true },
    { label: "False", value: false },
  ] as const,
  number: [
    { label: "Greater Than", value: "GREATER_THAN" },
    { label: "Less Than", value: "LESS_THAN" },
    { label: "Equal To", value: "EQUALS" },
    { label: "Between", value: "BETWEEN" },
  ],
};

const operatorMapping: { [key: string]: string } = {
  STARTS_WITH: "STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  CONTAINS: "CONTAINS",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  EQUAL_TO: "EQUALS",
  BETWEEN: "BETWEEN",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
  LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
  TRUE: "EQUALS",
  FALSE: "EQUALS",
};

const defaultStickyColumns = ["selection", "dropdown", "date"];

function determineType(meta: MetaData): string {
  if (meta.type) {
    return meta.type.toLowerCase();
  }
  const columnName = meta?.name?.toLowerCase();
  if (columnName.includes("id")) {
    return "number";
  } else if (columnName.includes("date") || columnName.includes("time")) {
    return "date";
  } else if (columnName.includes("is") || columnName.includes("has")) {
    return "boolean";
  } else {
    return "string";
  }
}

function formatColumnName(columnName: string) {
  return columnName.replace(/\.(\w)/g, (_, letter) => letter.toUpperCase());
}

export {
  defaultStickyColumns,
  filterCriteria,
  operatorMapping,
  determineType,
  formatColumnName,
};
