export type Receipt = {
  id: string;
  merchant: string;
  total: number;
  currency: string;
  purchasedOn: string;
  totalSek?: number;
};