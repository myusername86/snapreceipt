import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';
import { receiptsApi } from '../../api/client';

export type NewReceipt = {
  merchant: string;
  total: number;
  currency: string;
  purchasedOn: string;
};

export function useAddReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewReceipt) => receiptsApi.create(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['receipts'] });
      const previous = queryClient.getQueryData<Receipt[]>(['receipts']);
      const optimistic: Receipt = { id: `temp-${Date.now()}`, ...input };
      queryClient.setQueryData<Receipt[]>(['receipts'], (old = []) => [...old, optimistic]);
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['receipts'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });
}