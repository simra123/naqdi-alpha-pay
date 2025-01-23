interface tableColumns {
  field: string;
  headerName: string;
  sortable?: boolean;
  sticky?: boolean;
  searchable?: boolean;
  type?: any;
  dataValidator?: (value: string, row?: object) => any;
  copyable?: boolean;
  maxWidth?: number;
  link?: (row?: object) => any;
}

export type TableColumns = tableColumns[];

export enum WalletType {
  Static = "Static",
  Virtual = "Virtual",
}

export enum ModulesEnum {
  wallet = "wallet",
  merchant = "merchant",
  kyc = "kyc",
  integration = "integrations",
  payment = "payment",
  withdrawal = "withdrawal",
  transaction = "transaction",
  payout = "payout",
  user = "user",
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
