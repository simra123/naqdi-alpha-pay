interface tableColumns {
  field: string;
  headerName: string;
  sortable?: boolean;
  dataValidator?: (value: string) => any;
}

export type TableColumns = tableColumns[];
