import * as Yup from "yup";

declare module "yup" {
  interface StringSchema {
    cryptoAddress(blockchain: string, message?: string): this;
  }
}
