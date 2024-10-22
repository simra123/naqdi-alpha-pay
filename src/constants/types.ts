interface tableColumns {
  field: string;
  headerName: string;
  sortable?: boolean;
  dataValidator?: (value: string, row?: object) => any;
  copyable?: boolean;
}

export type TableColumns = tableColumns[];
