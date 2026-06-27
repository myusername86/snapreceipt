import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';
import { receiptsApi } from '../../api/client';

export function useUpdateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (receipt: Receipt) =>
      receiptsApi.update(receipt.id, {
        merchant: receipt.merchant,
        total: receipt.total,
        currency: receipt.currency,
        purchasedOn: receipt.purchasedOn,
      }),
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ['receipts'] });
      const previous = queryClient.getQueryData<Receipt[]>(['receipts']);
      queryClient.setQueryData<Receipt[]>(['receipts'], (old = []) =>
        old.map((r) => (r.id === updated.id ? updated : r)),
      );
      return { previous };
    },
    onError: (_e, _v, context) => {
      if (context?.previous) queryClient.setQueryData(['receipts'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });
}