interface tableColumns {
  field: string;
  headerName: string;
  sortable?: boolean;
  dataValidator?: (value: string, row?: object) => any;
}

export type TableColumns = tableColumns[];
