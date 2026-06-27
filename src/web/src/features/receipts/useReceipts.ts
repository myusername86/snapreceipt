import { useQuery } from '@tanstack/react-query';
import { receiptsApi } from '../../api/client';

export function useReceipts() {
  return useQuery({ queryKey: ['receipts'], queryFn: receiptsApi.list });
}