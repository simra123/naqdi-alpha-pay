interface tableColumns {
  field: string;
  headerName: string;
  sortable?: boolean;
  dataValidator?: (value: string, row?: object) => any;
  copyable?: boolean;
  link?: (row?: object) => any;
}

export type TableColumns = tableColumns[];

export enum WalletType {
  Static = "Static",
  Virtual = "Virtual",
}

export enum ModulesEnum {
  wallet = "wallet",
  integration = "integrations",
  user = "user",
  payment = "payment",
  withdrawal = "withdrawal",
  transaction = "transaction",
  payout = "payout",
}

export enum AccessLevelEnum {
  read = "read_only",
  full = "full_access",
  none = "none",
}

export enum ModalType {
  EDIT = "edit",
  CREATE = "create",
}
