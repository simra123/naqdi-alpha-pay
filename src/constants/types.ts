interface tableColumns {
  id?: number;
  field: string;
  target?: string;
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
  newsletter = "newsletter",
  feeLedger = "fee-ledger",
}

export const ModuleRoutes = {
  [ModulesEnum.wallet]: "/",
  [ModulesEnum.merchant]: "/merchants",
  [ModulesEnum.kyc]: "/kyc",
  [ModulesEnum.payment]: "/payments",
  [ModulesEnum.transaction]: "/transactions",
  [ModulesEnum.withdrawal]: "/withdrawals",
  [ModulesEnum.feeLedger]: "/fee-ledger",
  [ModulesEnum.newsletter]: "/news-signup",
  [ModulesEnum.integration]: "/settings/integrations",
  [ModulesEnum.user]: "/settings/users",
};

export type Permission = {
  id: number;
  module: ModulesEnum;
  access_level: AccessLevelEnum;
};

export type Permissions = {
  id: number;
  permission: Permission;
}[];

export enum AccessLevelEnum {
  read = "read_only",
  full = "full_access",
  none = "none",
}

export enum ModalType {
  EDIT = "edit",
  CREATE = "create",
}

export const supportOptions = [
  { label: "Incident", value: "Incident" },
  { label: "Question", value: "Question" },
  { label: "Problem", value: "Problem" },
  { label: "Refund", value: "Refund" },
  { label: "Transaction Issue", value: "Transaction Issue" },
  { label: "Loan", value: "Loan" },
];

export const transactionTypes = {
  Deposit: "Deposit",
  Withdraw: "Withdraw",
}

export const balanceType = {
  fiat: "Fiat",
  crypto: "Crypto",
}