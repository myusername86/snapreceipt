export interface Receipt {
  id: string;
  merchant: string;
  total: number;
  currency: string;
  purchasedOn: string;
}