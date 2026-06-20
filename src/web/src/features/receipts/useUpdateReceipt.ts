import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Receipt } from '../../api/types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api`;

async function putReceipt(receipt: Receipt): Promise<Receipt> {
  const response = await fetch(`${BASE_URL}/receipts/${receipt.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant: receipt.merchant,
      total: receipt.total,
      currency: receipt.currency,
      purchasedOn: receipt.purchasedOn,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update receipt');
  }
  return response.json();
}

export function useUpdateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putReceipt,
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