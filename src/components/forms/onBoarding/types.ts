export interface IdentityCheckState {
  documentFormat: string;
  document: {
    front: File | null;
    back: File | null;
  };
  country: string;
}
